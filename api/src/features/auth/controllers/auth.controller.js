import { User } from "../../user/models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../../../utils/createToken.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      throw new ApiError(
        400,
        "All fields (name, email, password) are required"
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "User already exists with this email");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!user) {
      throw new ApiError(500, "Failed to create user");
    }

    // Generate JWT token and set cookie
    generateToken(res, user._id, user.role);

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          imageUrl: user.imageUrl,
        },
        "User registered successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    // Find user by email (include password for comparison)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Generate JWT token and set cookie
    generateToken(res, user._id, user.role);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          imageUrl: user.imageUrl,
        },
        "Logged in successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res, next) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Logged out successfully"));
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private (requires verifyToken middleware)
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          imageUrl: user.imageUrl,
          addresses: user.addresses,
          wishlist: user.wishlist,
        },
        "User fetched successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};
