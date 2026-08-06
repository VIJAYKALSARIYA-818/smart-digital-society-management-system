const express = require("express");
const {
  createMaintenanceBill,
  deleteMaintenanceBill,
  getMaintenanceBillById,
  listMaintenanceBills,
  markBillPaid,
  updateMaintenanceBill,
} = require("../controllers/maintenanceController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", listMaintenanceBills);
router.post("/", createMaintenanceBill);
router.get("/:id", getMaintenanceBillById);
router.put("/:id", updateMaintenanceBill);
router.delete("/:id", deleteMaintenanceBill);
router.post("/:id/pay", markBillPaid);

module.exports = router;