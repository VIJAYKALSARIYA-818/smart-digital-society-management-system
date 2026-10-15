const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const { validateLogin, validateRegister } = require("../validators/authValidator");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../config/email");

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

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "No user found with this email",
    });
  }

  // Generate reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  try {
    // Send password reset email
    const emailResult = await sendPasswordResetEmail(user, resetToken);

    // In development mode, return the reset URL for testing
    if (emailResult.developmentMode && emailResult.resetUrl) {
      return res.status(200).json({
        success: true,
        message: "Password reset email sent successfully (development mode)",
        data: {
          developmentMode: true,
          resetUrl: emailResult.resetUrl,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
      data: null,
    });
  } catch (error) {
    // Clear reset token and expiration if email sending fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    console.error('Password reset email error:', error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to send password reset email. Please check your email configuration or try again later.",
    });
  }
});

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password using token
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password and confirm password are required",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters",
    });
  }

  // Hash token to compare with stored token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired reset token",
    });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const jwtToken = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: "Password reset successful",
    data: {
      user: formatUserResponse(user),
      token: jwtToken,
    },
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  forgotPassword,
  resetPassword,
};
