const express = require("express");
const {
  createPackage,
  deletePackage,
  getPackageById,
  listPackages,
  updatePackage,
} = require("../controllers/packageController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", listPackages);
router.post("/", createPackage);
router.get("/:id", getPackageById);
router.put("/:id", updatePackage);
router.delete("/:id", deletePackage);

module.exports = router;