import { Review } from "../models/review.model.js";
import { Product } from "../../product/models/product.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

/**
 * @route   POST /api/reviews
 * @access  Private
 */
export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");



    // Check for duplicate review (unique index: productId + userId)
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview)
      throw new ApiError(409, "You have already reviewed this product");

    const review = await Review.create({
      productId,
      userId,
      rating,
      comment,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, review, "Review created successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reviews for a product
 * @route   GET /api/reviews/product/:productId
 * @access  Public
 */
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");

    const [reviews, total] = await Promise.all([
      Review.find({ productId })
        .populate("userId", "name email")
        .sort("-createdAt")
        .skip(skip)
        .limit(limit),
      Review.countDocuments({ productId }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          reviews,
          pagination: {
            total,
            totalPages,
            currentPage: page,
            limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
        "Product reviews fetched successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reviews by the logged-in user
 * @route   GET /api/reviews/my-reviews
 * @access  Private
 */
export const getMyReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const userId = req.user._id;

    const [reviews, total] = await Promise.all([
      Review.find({ userId })
        .populate("productId", "name images price")
        .sort("-createdAt")
        .skip(skip)
        .limit(limit),
      Review.countDocuments({ userId }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          reviews,
          pagination: {
            total,
            totalPages,
            currentPage: page,
            limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
        "Your reviews fetched successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a review
 * @route   PATCH /api/reviews/:id
 * @access  Private
 */
export const updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(req.params.id);
    if (!review) throw new ApiError(404, "Review not found");

    if (review.userId.toString() !== userId.toString()) {
      throw new ApiError(403, "You are not authorized to update this review");
    }

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    return res
      .status(200)
      .json(new ApiResponse(200, review, "Review updated successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
export const deleteReview = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const review = await Review.findById(req.params.id);
    if (!review) throw new ApiError(404, "Review not found");

    if (review.userId.toString() !== userId.toString() && req.user.role !== "admin") {
      throw new ApiError(403, "You are not authorized to delete this review");
    }

    await review.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Review deleted successfully"));
  } catch (error) {
    next(error);
  }
};
