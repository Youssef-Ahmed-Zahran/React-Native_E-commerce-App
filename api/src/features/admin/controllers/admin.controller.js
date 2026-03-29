import { Product } from "../../product/models/product.model.js";
import { Category } from "../../category/models/category.model.js";
import { Order } from "../../order/models/order.model.js";
import { User } from "../../user/models/user.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
} from "../../../utils/cloudinaryUpload.js";

// --- PRODUCT CONTROLLERS ---

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category, images } = req.body;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !images ||
      !images.length
    ) {
      return next(
        new ApiError(
          400,
          "All required fields must be provided, including images"
        )
      );
    }

    // Upload images to Cloudinary
    const imageUrls = await uploadMultipleToCloudinary(images, "products");

    const newProduct = await Product.create({
      name,
      description,
      price,
      stock: stock || 0,
      category,
      images: imageUrls,
    });

    res
      .status(201)
      .json(new ApiResponse(201, newProduct, "Product created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const category = req.query.category || "";

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    const totalCount = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1, _id: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          products,
          pagination: {
            total: totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
          },
        },
        "Products fetched successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category, images } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }

    let updatedImages = product.images;

    if (images !== undefined) {
      const imagesArray = Array.isArray(images) ? images : [];
      // images can be a mix of updated base64 strings and existing URLs
      const base64Images = imagesArray.filter((img) => img.startsWith("data:image"));
      const existingUrls = imagesArray.filter((img) => img.startsWith("http"));

      let newlyUploaded = [];
      if (base64Images.length > 0) {
        newlyUploaded = await uploadMultipleToCloudinary(
          base64Images,
          "products"
        );
      }

      updatedImages = [...existingUrls, ...newlyUploaded];

      // Delete images that are no longer present
      const imagesToDelete = product.images.filter(
        (img) => !existingUrls.includes(img)
      );
      if (imagesToDelete.length > 0) {
        await deleteMultipleFromCloudinary(imagesToDelete);
      }
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.stock = stock !== undefined ? stock : product.stock;
    if (category) product.category = category;
    product.images = updatedImages;

    await product.save();

    res
      .status(200)
      .json(new ApiResponse(200, product, "Product updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }

    if (product.images && product.images.length > 0) {
      await deleteMultipleFromCloudinary(product.images);
    }

    await product.deleteOne();

    res
      .status(200)
      .json(new ApiResponse(200, null, "Product deleted successfully"));
  } catch (error) {
    next(error);
  }
};

// --- CATEGORY CONTROLLERS ---

export const createCategory = async (req, res, next) => {
  try {
    const { name, image } = req.body;

    if (!name) {
      return next(new ApiError(400, "Category name is required"));
    }

    let imageUrl = "";
    if (image && image.startsWith("data:image")) {
      imageUrl = await uploadToCloudinary(image, "categories");
    } else {
      imageUrl = image || "";
    }

    const category = await Category.create({ name, image: imageUrl });

    res
      .status(201)
      .json(new ApiResponse(201, category, "Category created successfully"));
  } catch (error) {
    next(error);
  }
};

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
      .sort({ createdAt: -1, _id: 1 })
      .skip(skip)
      .limit(limit);

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

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return next(new ApiError(404, "Category not found"));
    }

    if (name) category.name = name;

    if (image && image.startsWith("data:image")) {
      const imageUrl = await uploadToCloudinary(image, "categories");
      if (category.image) {
        await deleteFromCloudinary(category.image);
      }
      category.image = imageUrl;
    } else if (image !== undefined) {
      category.image = image;
    }

    await category.save();

    res
      .status(200)
      .json(new ApiResponse(200, category, "Category updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return next(new ApiError(404, "Category not found"));
    }

    if (category.image) {
      await deleteFromCloudinary(category.image);
    }

    await category.deleteOne();

    res
      .status(200)
      .json(new ApiResponse(200, null, "Category deleted successfully"));
  } catch (error) {
    next(error);
  }
};

// --- ORDER CONTROLLERS ---

export const getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    let query = {};
    if (search) {
      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id");
      const userIds = matchingUsers.map((user) => user._id);

      query = {
        $or: [
          { orderNumber: { $regex: search, $options: "i" } },
          { user: { $in: userIds } },
        ],
      };
    }

    const totalCount = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1, _id: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          orders,
          pagination: {
            total: totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
          },
        },
        "Orders fetched successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return next(new ApiError(400, "Invalid order status"));
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return next(new ApiError(404, "Order not found"));
    }

    order.orderStatus = status;

    if (status === "shipped") {
      order.shippedAt = Date.now();
    } else if (status === "delivered") {
      order.deliveredAt = Date.now();
      if (!order.isPaid) {
        order.paidAt = Date.now();
        // Option to log an incomplete payment setting here
      }
    }

    await order.save();

    res
      .status(200)
      .json(new ApiResponse(200, order, "Order status updated successfully"));
  } catch (error) {
    next(error);
  }
};

// --- CUSTOMER CONTROLLERS ---

export const getAllCustomers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    let query = { role: "user" };
    if (search) {
      query = {
        $and: [
          { role: "user" },
          {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          },
        ],
      };
    }

    const totalCount = await User.countDocuments(query);
    const customers = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1, _id: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          customers,
          pagination: {
            total: totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
          },
        },
        "Customers fetched successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

// --- DASHBOARD CONTROLLERS ---

export const getDashboardStats = async (req, res, next) => {
  try {
    // Basic metrics
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "user" });
    const totalOrders = await Order.countDocuments();

    // Calculate revenue using aggregation or by mapping through valid orders (aggregation preferred for scalability)
    const revenueStats = await Order.aggregate([
      { $match: { orderStatus: { $ne: "cancelled" } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue =
      revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

    // Get 5 most recent orders
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1, _id: 1 })
      .limit(5);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          totalProducts,
          totalCustomers,
          totalOrders,
          totalRevenue,
          recentOrders,
        },
        "Dashboard statistics fetched successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};
