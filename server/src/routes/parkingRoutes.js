const express = require("express");
const {
  createParking,
  deleteParking,
  getParkingById,
  listParking,
  updateParking,
} = require("../controllers/parkingController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", listParking);
router.post("/", createParking);
router.get("/:id", getParkingById);
router.put("/:id", updateParking);
router.delete("/:id", deleteParking);

module.exports = router;