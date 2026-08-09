const express = require("express");
const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

// Settings management - admin only
router.use(adminOnly);

router.get("/", getSettings);
router.put("/", updateSettings);

module.exports = router;