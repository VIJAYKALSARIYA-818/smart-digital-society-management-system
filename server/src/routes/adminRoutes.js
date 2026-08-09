const express = require("express");
const {
  createUser,
  deleteUser,
  getRoles,
  getUserById,
  listUsers,
  updateUser,
  updateUserRole,
  updateUserStatus,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

// All admin routes require admin role
router.use(adminOnly);

router.get("/users", listUsers);
router.post("/users", createUser);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.put("/users/:id/role", updateUserRole);
router.put("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);
router.get("/roles", getRoles);

module.exports = router;