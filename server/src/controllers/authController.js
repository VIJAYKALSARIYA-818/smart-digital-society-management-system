const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const { validateLogin, validateRegister } = require("../validators/authValidator");

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

/**
 * @route   POST /api/auth/register
 * @desc    Register a new resident user
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const validationErrors = validateRegister(req.body);

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  const { fullName, email, phone, flatNumber, password } = req.body;

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
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: formatUserResponse(user),
      token,
    },
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const validationErrors = validateLogin(req.body);

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
    "+password",
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: "Account is deactivated. Please contact society admin",
    });
  }

  const isPasswordValid = await user.matchPassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: formatUserResponse(user),
      token,
    },
  });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged-in user profile
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    data: {
      user: formatUserResponse(req.user),
    },
  });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (UI/stateless JWT flow)
 * @access  Private
 */
const logoutUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logout successful",
    data: null,
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
};
