import mongoose from "mongoose";
import { Order } from "../models/order.model.js";
import { Product } from "../../product/models/product.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

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
        .sort("-createdAt")
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
