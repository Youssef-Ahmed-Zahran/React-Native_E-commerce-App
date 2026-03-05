import { Wishlist } from "../models/wishlist.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      throw new ApiError(400, "Product ID is required");
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $addToSet: { products: productId } },
      { new: true, upsert: true }
    );

    return res
      .status(201)
      .json(new ApiResponse(201, wishlist, "Product added to wishlist"));
  } catch (error) {
    next(error);
  }
};

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const wishlistDoc = await Wishlist.findOne({ user: req.user._id });

    if (!wishlistDoc || wishlistDoc.products.length === 0) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            {
              products: [],
              pagination: {
                totalItems: 0,
                totalPages: 0,
                currentPage: page,
                limit,
              },
            },
            "Wishlist is empty"
          )
        );
    }

    const totalItems = wishlistDoc.products.length;
    const totalPages = Math.ceil(totalItems / limit);

    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: "products",
      options: { skip, limit },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            ...wishlist.toObject(),
            pagination: { totalItems, totalPages, currentPage: page, limit },
          },
          "Wishlist fetched successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { products: productId } },
      { new: true }
    );

    if (!wishlist) {
      throw new ApiError(404, "Wishlist not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, wishlist, "Product removed from wishlist"));
  } catch (error) {
    next(error);
  }
};
