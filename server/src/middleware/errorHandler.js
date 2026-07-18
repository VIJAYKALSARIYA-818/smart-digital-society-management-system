/**
 * Centralized Express error handler.
 * Must be registered after all routes.
 */
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error) => error.message);

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";

    return res.status(409).json({
      success: false,
      message: `Duplicate value for ${field}. Please use another value`,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid resource identifier",
    });
  }

  if (err.message === "JWT_SECRET is not defined in environment variables") {
    return res.status(500).json({
      success: false,
      message: "Server configuration error",
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
