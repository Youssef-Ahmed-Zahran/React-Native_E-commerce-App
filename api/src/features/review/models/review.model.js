import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // --- Review type ---
    reviewType: {
      type: String,
      enum: ["order", "product"],
      required: true,
    },

    // --- Only for order-based reviews ---
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: function () {
        return this.reviewType === "order";
      },
      default: null,
    },

    // --- Stars (both types) ---
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // --- Comment (only for single-product reviews) ---
    comment: {
      type: String,
      required: function () {
        return this.reviewType === "product";
      },
      default: null,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

// Prevent duplicate reviews of the same type by the same user on the same product
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

// Validator: order reviews must NOT have a comment
reviewSchema.pre("validate", function (next) {
  if (this.reviewType === "order" && this.comment) {
    return next(new Error("Order reviews cannot include a comment."));
  }
  next();
});

export const Review = mongoose.model("Review", reviewSchema);
