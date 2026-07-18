/**
 * Wraps async route handlers to forward errors to Express error middleware.
 * @param {Function} fn - Async controller function
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
