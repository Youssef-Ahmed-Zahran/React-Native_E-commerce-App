import mongoose from "mongoose";
import { Order } from "../models/order.model.js";
import { Product } from "../../product/models/product.model.js";
import { Cart } from "../../cart/models/cart.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

/**
 * @desc    Create a new order from the user's cart and reduce product stock
 * @route   POST /api/order
 * @access  Private
 */
export const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { shippingAddress, paymentMethod, shippingCost = 0, taxAmount = 0 } = req.body;

    if (!shippingAddress || !paymentMethod) {
      throw new ApiError(400, "Shipping address and payment method are required");
    }

    // Fetch cart with populated product details
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name images price stock"
    );

    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, "Your cart is empty");
    }

    // Validate stock availability for every item
    for (const item of cart.items) {
      const product = item.product;
      if (!product) {
        throw new ApiError(404, "One or more products in your cart no longer exist");
      }
      if (product.stock < item.quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`
        );
      }
    }

    // Build order items from cart
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images[0] || "",
      price: item.product.price,
      quantity: item.quantity,
    }));

    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const totalAmount = subtotal + shippingCost + taxAmount;

    // Create the order inside the transaction
    const [order] = await Order.create(
      [
        {
          user: req.user._id,
          items: orderItems,
          shippingAddress,
          paymentMethod,
          subtotal,
          shippingCost,
          taxAmount,
          totalAmount,
          paidAt: new Date(), // mark as paid immediately
        },
      ],
      { session }
    );

    // Reduce stock for each ordered product
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } },
        { session, new: true }
      );
    }

    // Clear the cart
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { session }
    );

    await session.commitTransaction();

    return res
      .status(201)
      .json(new ApiResponse(201, order, "Order created successfully"));
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

/**
 * @desc    Get a single order by ID
 * @route   GET /api/order/:id
 * @access  Private
 */
export const getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.product",
      "name images price"
    );

    if (!order) throw new ApiError(404, "Order not found");

    // Ensure the order belongs to the requesting user
    if (order.user.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Not authorized to view this order");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, order, "Order fetched successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders of the logged-in user
 * @route   GET /api/order
 * @access  Private
 */
export const getUserOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, totalOrders] = await Promise.all([
      Order.find({ user: req.user._id })
        .sort({ createdAt: -1, _id: 1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments({ user: req.user._id }),
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          orders,
          pagination: {
            totalOrders,
            totalPages,
            currentPage: page,
            limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
        "User orders fetched successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PATCH /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(req.params.id).session(session);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    // Only owner can cancel
    if (order.user.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to cancel this order");
    }

    // Can only cancel pending orders
    if (order.orderStatus !== "pending") {
      throw new ApiError(
        400,
        `Order cannot be cancelled because it is already ${order.orderStatus}`
      );
    }

    // Restore stock for each item
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { session }
      );
    }

    order.orderStatus = "cancelled";
    await order.save({ session });

    await session.commitTransaction();

    // Message based on payment status
    const message = order.isPaid
      ? "Order cancelled successfully. Since you have already paid, a refund will be processed to your original payment method within 5-7 business days."
      : "Order cancelled successfully.";

    return res.status(200).json(new ApiResponse(200, order, message));
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
