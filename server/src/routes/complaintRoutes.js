const express = require("express");
const {
  createComplaint,
  deleteComplaint,
  getComplaintById,
  listComplaints,
  updateComplaint,
} = require("../controllers/complaintController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", listComplaints);
router.post("/", createComplaint);
router.get("/:id", getComplaintById);
router.put("/:id", updateComplaint);
router.delete("/:id", deleteComplaint);

module.exports = router;