const express = require("express");
const {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.post("/logout", protect, logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// OAuth routes (only if configured)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const {
    googleAuth,
    googleCallback,
  } = require("../controllers/oauthController");
  router.get("/google", googleAuth);
  router.get("/google/callback", googleCallback);
}

module.exports = router;
