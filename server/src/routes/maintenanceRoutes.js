const express = require("express");
const {
  createMaintenanceBill,
  deleteMaintenanceBill,
  getMaintenanceBillById,
  listMaintenanceBills,
  markBillPaid,
  updateMaintenanceBill,
} = require("../controllers/maintenanceController");
const { MODULE_ACCESS } = require("../constants/roles");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorize(...MODULE_ACCESS.maintenance));

router.get("/", listMaintenanceBills);
router.post("/", createMaintenanceBill);
router.get("/:id", getMaintenanceBillById);
router.put("/:id", updateMaintenanceBill);
router.delete("/:id", deleteMaintenanceBill);
router.post("/:id/pay", markBillPaid);

module.exports = router;