const Notice = require("../models/Notice");
const asyncHandler = require("../utils/asyncHandler");
const { validateNoticePayload } = require("../validators/noticeValidator");

const formatNoticeResponse = (notice) => ({
  id: notice._id,
  title: notice.title,
  description: notice.description,
  category: notice.category,
  priority: notice.priority,
  publishDate: notice.publishDate,
  expiryDate: notice.expiryDate,
  attachment: notice.attachment,
  createdBy: notice.createdBy,
  isPublished: notice.isPublished,
  createdAt: notice.createdAt,
  updatedAt: notice.updatedAt,
});

const buildSearchFilter = (search) => {
  if (!search) {
    return {};
  }

  const safeSearch = search.trim();

  return {
    $or: [
      { title: { $regex: safeSearch, $options: "i" } },
      { description: { $regex: safeSearch, $options: "i" } },
      { category: { $regex: safeSearch, $options: "i" } },
      { priority: { $regex: safeSearch, $options: "i" } },
      { attachment: { $regex: safeSearch, $options: "i" } },
    ],
  };
};

const parsePagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);

  return { page, limit, skip: (page - 1) * limit };
};

const buildFilter = (query) => {
  const filter = {
    ...buildSearchFilter(query.search),
  };

  if (query.category) {
    filter.category = query.category;
  }

  if (query.priority) {
    filter.priority = query.priority;
  }

  if (query.isPublished !== undefined) {
    if (query.isPublished === "true") {
      filter.isPublished = true;
    } else if (query.isPublished === "false") {
      filter.isPublished = false;
    }
  }

  const now = new Date();
  if (query.activeOnly === "true" || query.activeOnly === undefined) {
    filter.publishDate = { $lte: now };
    filter.expiryDate = { $gte: now };
    filter.isPublished = true;
  }

  return filter;
};

const listNotices = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = buildFilter(req.query);
  const sort = { createdAt: -1 };

  const [notices, total] = await Promise.all([
    Notice.find(filter).sort(sort).skip(skip).limit(limit),
    Notice.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Notices fetched successfully",
    data: {
      notices: notices.map(formatNoticeResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

const getNoticeById = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (!notice) {
    return res.status(404).json({
      success: false,
      message: "Notice not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Notice fetched successfully",
    data: {
      notice: formatNoticeResponse(notice),
    },
  });
});

const createNotice = asyncHandler(async (req, res) => {
  const authenticatedUserId = req.user?._id || req.user?.id;
  const noticeData = {
    ...req.body,
    createdBy: authenticatedUserId,
  };

  const validationErrors = validateNoticePayload(noticeData);

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  const notice = await Notice.create(noticeData);

  res.status(201).json({
    success: true,
    message: "Notice created successfully",
    data: {
      notice: formatNoticeResponse(notice),
    },
  });
});

const updateNotice = asyncHandler(async (req, res) => {
  const validationErrors = validateNoticePayload(req.body, { partial: true });

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  const notice = await Notice.findById(req.params.id);

  if (!notice) {
    return res.status(404).json({
      success: false,
      message: "Notice not found",
    });
  }

  if (req.body.title !== undefined) notice.title = req.body.title.trim();
  if (req.body.description !== undefined) notice.description = req.body.description.trim();
  if (req.body.category !== undefined) notice.category = req.body.category;
  if (req.body.priority !== undefined) notice.priority = req.body.priority;
  if (req.body.publishDate !== undefined) notice.publishDate = req.body.publishDate;
  if (req.body.expiryDate !== undefined) notice.expiryDate = req.body.expiryDate;
  if (req.body.attachment !== undefined) notice.attachment = req.body.attachment ? req.body.attachment.trim() : "";
  if (req.body.createdBy !== undefined) notice.createdBy = req.body.createdBy;
  if (req.body.isPublished !== undefined) notice.isPublished = req.body.isPublished;

  if (notice.publishDate && notice.expiryDate && new Date(notice.expiryDate) <= new Date(notice.publishDate)) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: ["Expiry date must be after publish date"],
    });
  }

  const updatedNotice = await notice.save();

  res.status(200).json({
    success: true,
    message: "Notice updated successfully",
    data: {
      notice: formatNoticeResponse(updatedNotice),
    },
  });
});

const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (!notice) {
    return res.status(404).json({
      success: false,
      message: "Notice not found",
    });
  }

  await notice.deleteOne();

  res.status(200).json({
    success: true,
    message: "Notice deleted successfully",
    data: null,
  });
});

const publishNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (!notice) {
    return res.status(404).json({
      success: false,
      message: "Notice not found",
    });
  }

  notice.isPublished = true;
  const updatedNotice = await notice.save();

  res.status(200).json({
    success: true,
    message: "Notice published successfully",
    data: {
      notice: formatNoticeResponse(updatedNotice),
    },
  });
});

const unpublishNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (!notice) {
    return res.status(404).json({
      success: false,
      message: "Notice not found",
    });
  }

  notice.isPublished = false;
  const updatedNotice = await notice.save();

  res.status(200).json({
    success: true,
    message: "Notice unpublished successfully",
    data: {
      notice: formatNoticeResponse(updatedNotice),
    },
  });
});

module.exports = {
  listNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  publishNotice,
  unpublishNotice,
};