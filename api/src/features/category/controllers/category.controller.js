import { Category } from "../models/category.model.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { ApiError } from "../../../utils/ApiError.js";

export const getAllCategories = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    let query = {};
    if (search) {
      query = { name: { $regex: search, $options: "i" } };
    }

    const totalCount = await Category.countDocuments(query);
    const categories = await Category.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!categories || categories.length === 0) {
      return next(new ApiError(404, "No categories found"));
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          categories,
          pagination: {
            total: totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
          },
        },
        "Categories fetched successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};
