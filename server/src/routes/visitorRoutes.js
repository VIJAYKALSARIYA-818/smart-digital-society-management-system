const express = require("express");
const {
  checkInVisitor,
  checkOutVisitor,
  createVisitor,
  deleteVisitor,
  getVisitorById,
  listVisitors,
  updateVisitor,
} = require("../controllers/visitorController");
const { MODULE_ACCESS } = require("../constants/roles");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorize(...MODULE_ACCESS.visitors));

router.get("/", listVisitors);
router.post("/", createVisitor);
router.get("/:id", getVisitorById);
router.put("/:id", updateVisitor);
router.delete("/:id", deleteVisitor);
router.post("/:id/check-in", checkInVisitor);
router.post("/:id/check-out", checkOutVisitor);

module.exports = router;