const jwt = require("jsonwebtoken");

/**
 * Generates a signed JWT for an authenticated user.
 * @param {string} userId - MongoDB user document ID
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRE || "7d";

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign({ id: userId }, secret, { expiresIn });
};

module.exports = generateToken;
