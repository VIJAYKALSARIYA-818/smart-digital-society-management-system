const mongoose = require("mongoose");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { validateUserUpdate, validateUserCreate, USER_ROLES } = require("../validators/adminValidator");

const formatUserResponse = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  flatNumber: user.flatNumber,
  role: user.role,
  profileImage: user.profileImage,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const buildSearchFilter = (search) => {
  if (!search) {
    return {};
  }

  const safeSearch = search.trim();

  return {
    $or: [
      { fullName: { $regex: safeSearch, $options: "i" } },
      { email: { $regex: safeSearch, $options: "i" } },
      { flatNumber: { $regex: safeSearch, $options: "i" } },
      { phone: { $regex: safeSearch, $options: "i" } },
    ],
  };
};

const parsePagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);

  return { page, limit, skip: (page - 1) * limit };
};

const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const searchFilter = buildSearchFilter(req.query.search);
  const roleFilter = {};
  const statusFilter = {};

  if (req.query.role) {
    roleFilter.role = req.query.role;
  }

  if (req.query.isActive !== undefined) {
    if (req.query.isActive === "true") {
      statusFilter.isActive = true;
    } else if (req.query.isActive === "false") {
      statusFilter.isActive = false;
    }
  }

  const filter = {
    ...statusFilter,
    ...roleFilter,
    ...searchFilter,
  };

  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .select("-password"),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: {
      users: users.map(formatUserResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: {
      user: formatUserResponse(user),
    },
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const validationErrors = validateUserUpdate(req.body, { partial: true });

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Prevent email conflicts
  if (req.body.email && req.body.email !== user.email) {
    const existingUser = await User.findOne({
      email: req.body.email.trim().toLowerCase(),
      _id: { $ne: user._id },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already in use by another user",
      });
    }
  }

  // Prevent deactivating the last admin
  if (req.body.isActive === false && user.role === "Society Admin") {
    const adminCount = await User.countDocuments({
      role: "Society Admin",
      isActive: true,
      _id: { $ne: user._id },
    });

    if (adminCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot deactivate the last active admin user",
      });
    }
  }

  // Update allowed fields
  const allowedFields = [
    "fullName",
    "email",
    "phone",
    "flatNumber",
    "role",
    "isActive",
    "profileImage",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      if (field === "email") {
        user[field] = req.body[field].trim().toLowerCase();
      } else if (typeof req.body[field] === "string") {
        user[field] = req.body[field].trim();
      } else {
        user[field] = req.body[field];
      }
    }
  });

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: {
      user: formatUserResponse(updatedUser),
    },
  });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({
      success: false,
      message: "Role is required",
    });
  }

  if (!USER_ROLES.includes(role)) {
    return res.status(400).json({
      success: false,
      message: `Invalid role. Must be one of: ${USER_ROLES.join(", ")}`,
    });
  }

  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Prevent removing the last admin's admin role
  if (user.role === "Society Admin" && role !== "Society Admin") {
    const adminCount = await User.countDocuments({
      role: "Society Admin",
      isActive: true,
      _id: { $ne: user._id },
    });

    if (adminCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot change the role of the last active admin",
      });
    }
  }

  user.role = role;
  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: "User role updated successfully",
    data: {
      user: formatUserResponse(updatedUser),
    },
  });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  if (typeof isActive !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "isActive must be a boolean value",
    });
  }

  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Prevent deactivating the last admin
  if (!isActive && user.role === "Society Admin") {
    const adminCount = await User.countDocuments({
      role: "Society Admin",
      isActive: true,
      _id: { $ne: user._id },
    });

    if (adminCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot deactivate the last active admin user",
      });
    }
  }

  user.isActive = isActive;
  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: `User ${isActive ? "activated" : "deactivated"} successfully`,
    data: {
      user: formatUserResponse(updatedUser),
    },
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Prevent deleting the last admin
  if (user.role === "Society Admin") {
    const adminCount = await User.countDocuments({
      role: "Society Admin",
      _id: { $ne: user._id },
    });

    if (adminCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete the last admin user",
      });
    }
  }

  // Prevent self-deletion
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: "Cannot delete your own account",
    });
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: null,
  });
});

const getRoles = asyncHandler(async (req, res) => {
  const roleDescriptions = {
    "Society Admin": "Full access to all society management features",
    "Security Guard": "Access to visitor management and security features",
    "Maintenance Staff": "Access to maintenance and complaint management",
    "Resident": "Limited access to personal information and basic features",
  };

  const roles = USER_ROLES.map((role) => ({
    name: role,
    description: roleDescriptions[role] || "Standard user role",
  }));

  res.status(200).json({
    success: true,
    message: "Roles fetched successfully",
    data: {
      roles,
    },
  });
});

const createUser = asyncHandler(async (req, res) => {
  const validationErrors = validateUserCreate(req.body);

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  const { fullName, email, phone, flatNumber, password, role } = req.body;

  const existingUser = await User.findOne({ email: email.trim().toLowerCase() });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists with this email",
    });
  }

  const user = await User.create({
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    flatNumber: flatNumber.trim(),
    password,
    role: role || "Resident",
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: {
      user: formatUserResponse(user),
    },
  });
});

module.exports = {
  listUsers,
  getUserById,
  updateUser,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getRoles,
  createUser,
};