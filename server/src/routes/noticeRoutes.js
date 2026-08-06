const express = require("express");
const {
  createNotice,
  deleteNotice,
  getNoticeById,
  listNotices,
  publishNotice,
  unpublishNotice,
  updateNotice,
} = require("../controllers/noticeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", listNotices);
router.post("/", createNotice);
router.get("/:id", getNoticeById);
router.put("/:id", updateNotice);
router.delete("/:id", deleteNotice);
router.post("/:id/publish", publishNotice);
router.post("/:id/unpublish", unpublishNotice);

module.exports = router;