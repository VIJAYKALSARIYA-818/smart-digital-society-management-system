const express = require("express");
const {
  createResident,
  deleteResident,
  getResidentById,
  listResidents,
  updateResident,
} = require("../controllers/residentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", listResidents);
router.post("/", createResident);
router.get("/:id", getResidentById);
router.put("/:id", updateResident);
router.delete("/:id", deleteResident);

module.exports = router;