import { User } from "../models/user.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import bcrypt from "bcryptjs";

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, imageUrl } = req.body;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check if authorized (only owner or admin can update)
    if (
      user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      throw new ApiError(403, "You are not authorized to update this profile");
    }

    // Update fields
    if (name) user.name = name;
    if (imageUrl) user.imageUrl = imageUrl;

    const updatedUser = await user.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedUser, "User profile updated successfully")
      );
  } catch (error) {
    next(error);
  }
};

// @desc    Update user password
// @route   PATCH /api/users/:id/password
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new ApiError(400, "Current and new password are required");
    }

    // Find user with password selected
    const user = await User.findById(id).select("+password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check if authorized
    if (
      user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      throw new ApiError(403, "You are not authorized to change this password");
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid current password");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Password updated successfully"));
  } catch (error) {
    next(error);
  }
};

// @desc    Add Address
// @route   POST /api/addresses
// @access  Private
export const addAddress = async (req, res, next) => {
  try {
    const {
      street,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User not found");

    const newAddress = {
      street,
      city,
      state,
      postalCode,
      country,
      isDefault,
    };

    if (isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses.push(newAddress);
    await user.save();

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          {
            _id: user._id,
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl,
            addresses: user.addresses,
            wishlist: user.wishlist,
            role: user.role,
          },
          "Address added successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

// @desc    Get Address
// @route   GET /api/addresses
// @access  Private
export const getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User not found");
    return res
      .status(200)
      .json(
        new ApiResponse(200, user.addresses, "Addresses fetched successfully")
      );
  } catch (error) {
    next(error);
  }
};

// @desc    Update Address
// @route   PUT /api/addresses/:addressesId
// @access  Private
export const updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User not found");

    const address = user.addresses.id(addressId);
    if (!address) throw new ApiError(404, "Address not found");

    Object.assign(address, req.body);

    if (req.body.isDefault) {
      user.addresses.forEach((addr) => {
        if (addr._id.toString() !== addressId) addr.isDefault = false;
      });
    }

    await user.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            _id: user._id,
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl,
            addresses: user.addresses,
            wishlist: user.wishlist,
            role: user.role,
          },
          "Address updated successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};
// @desc    Delete Address
// @route   DELETE /api/addresses/:addressesId
// @access  Private
export const deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User not found");

    const address = user.addresses.id(addressId);
    if (!address) throw new ApiError(404, "Address not found");

    address.deleteOne();
    await user.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            _id: user._id,
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl,
            addresses: user.addresses,
            wishlist: user.wishlist,
            role: user.role,
          },
          "Address deleted successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};
