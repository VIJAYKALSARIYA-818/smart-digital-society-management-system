const express = require("express");
const {
  createParking,
  deleteParking,
  getParkingById,
  listParking,
  updateParking,
} = require("../controllers/parkingController");
const { MODULE_ACCESS } = require("../constants/roles");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorize(...MODULE_ACCESS.parking));

router.get("/", listParking);
router.post("/", createParking);
router.get("/:id", getParkingById);
router.put("/:id", updateParking);
router.delete("/:id", deleteParking);

module.exports = router;