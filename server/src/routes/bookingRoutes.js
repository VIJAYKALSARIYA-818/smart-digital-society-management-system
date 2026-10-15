const express = require("express");
const {
  createBooking,
  deleteBooking,
  getBookingById,
  listBookings,
  updateBooking,
} = require("../controllers/bookingController");
const { MODULE_ACCESS } = require("../constants/roles");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorize(...MODULE_ACCESS.bookings));

router.get("/", listBookings);
router.post("/", createBooking);
router.get("/:id", getBookingById);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

module.exports = router;