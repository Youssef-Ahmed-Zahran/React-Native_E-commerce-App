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

    // --- Stars ---
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // --- Comment ---
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

// Prevent duplicate reviews of the same type by the same user on the same product
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

reviewSchema.statics.calcAverageRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { productId } },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const Product = mongoose.model("Product");
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: stats[0].averageRating,
      totalReviews: stats[0].totalReviews,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      totalReviews: 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRating(this.productId);
});

reviewSchema.post("deleteOne", { document: true, query: false }, function () {
  this.constructor.calcAverageRating(this.productId);
});

export const Review = mongoose.model("Review", reviewSchema);
