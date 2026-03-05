import jwt from "jsonwebtoken";
import { User } from "../features/user/models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      throw new ApiError(401, "Unauthorized - No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      throw new ApiError(401, "Unauthorized - Invalid token");
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Admin and user authorization
export const verifyTokenAndAuthorization = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      throw new ApiError(401, "Unauthorized - No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      throw new ApiError(401, "Unauthorized - Invalid token");
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user._id.toString() !== req.params.id && user.role !== "admin") {
      throw new ApiError(403, "Forbidden - You can only access your own account");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Admin only
export const verifyTokenAndAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      throw new ApiError(401, "Unauthorized - No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      throw new ApiError(401, "Unauthorized - Invalid token");
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.role !== "admin") {
      throw new ApiError(403, "Forbidden - Admin access required");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
