import { Cart } from "../models/cart.model.js";
import { Product } from "../../product/models/product.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart) {
      return res
        .status(200)
        .json(new ApiResponse(200, { items: [] }, "Cart is empty"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, cart, "Cart fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) throw new ApiError(400, "Product ID is required");

    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");
    if (product.stock < quantity) {
      throw new ApiError(400, `Insufficient stock for ${product.name}`);
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity, price: product.price }],
      });
    } else {
      const cartItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (cartItemIndex > -1) {
        const newQuantity = cart.items[cartItemIndex].quantity + quantity;
        if (product.stock < newQuantity) {
          throw new ApiError(400, `Only ${product.stock} items available`);
        }
        cart.items[cartItemIndex].quantity = newQuantity;
        cart.items[cartItemIndex].price = product.price;
      } else {
        cart.items.push({ product: productId, quantity, price: product.price });
      }

      await cart.save();
    }

    return res
      .status(201)
      .json(new ApiResponse(201, cart, "Product added to cart"));
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1)
      throw new ApiError(400, "Valid quantity is required");

    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");
    if (product.stock < quantity) {
      throw new ApiError(400, `Only ${product.stock} items available`);
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new ApiError(404, "Cart not found");

    const cartItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (cartItemIndex === -1)
      throw new ApiError(404, "Product not found in cart");

    cart.items[cartItemIndex].quantity = quantity;
    await cart.save();

    return res
      .status(200)
      .json(new ApiResponse(200, cart, "Cart item updated successfully"));
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { items: { product: productId } } },
      { new: true }
    );

    if (!cart) throw new ApiError(404, "Cart not found");

    return res
      .status(200)
      .json(new ApiResponse(200, cart, "Product removed from cart"));
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { new: true }
    );

    if (!cart) throw new ApiError(404, "Cart not found");

    return res
      .status(200)
      .json(new ApiResponse(200, cart, "Cart cleared successfully"));
  } catch (error) {
    next(error);
  }
};
