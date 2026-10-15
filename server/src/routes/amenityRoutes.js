const express = require("express");
const {
  createAmenity,
  deleteAmenity,
  getAmenityById,
  listAmenities,
  updateAmenity,
} = require("../controllers/amenityController");
const { MODULE_ACCESS } = require("../constants/roles");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorize(...MODULE_ACCESS.amenities));

router.get("/", listAmenities);
router.post("/", createAmenity);
router.get("/:id", getAmenityById);
router.put("/:id", updateAmenity);
router.delete("/:id", deleteAmenity);

module.exports = router;