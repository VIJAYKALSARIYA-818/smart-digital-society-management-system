const Complaint = require("../models/Complaint");
const Resident = require("../models/Resident");
const asyncHandler = require("../utils/asyncHandler");
const { validateComplaintPayload } = require("../validators/complaintValidator");

const formatComplaintResponse = (complaint) => ({
  id: complaint._id,
  title: complaint.title,
  description: complaint.description,
  category: complaint.category,
  priority: complaint.priority,
  status: complaint.status,
  residentName: complaint.residentName,
  residentId: complaint.residentId,
  flatNumber: complaint.flatNumber,
  assignedTo: complaint.assignedTo,
  resolution: complaint.resolution,
  isActive: complaint.isActive,
  createdAt: complaint.createdAt,
  updatedAt: complaint.updatedAt,
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
      { residentName: { $regex: safeSearch, $options: "i" } },
      { flatNumber: { $regex: safeSearch, $options: "i" } },
      { assignedTo: { $regex: safeSearch, $options: "i" } },
      { resolution: { $regex: safeSearch, $options: "i" } },
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

  if (query.status) {
    filter.status = query.status;
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.priority) {
    filter.priority = query.priority;
  }

  if (query.isActive !== undefined) {
    if (query.isActive === "true") {
      filter.isActive = true;
    } else if (query.isActive === "false") {
      filter.isActive = false;
    }
  }

  return filter;
};

const listComplaints = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = buildFilter(req.query);
  const sort = { createdAt: -1 };

  const [complaints, total] = await Promise.all([
    Complaint.find(filter).sort(sort).skip(skip).limit(limit),
    Complaint.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Complaints fetched successfully",
    data: {
      complaints: complaints.map(formatComplaintResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Complaint fetched successfully",
    data: {
      complaint: formatComplaintResponse(complaint),
    },
  });
});

const createComplaint = asyncHandler(async (req, res) => {
  const validationErrors = validateComplaintPayload(req.body);

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  const {
    title,
    description,
    category,
    priority,
    status,
    residentName,
    flatNumber,
    assignedTo,
    resolution,
    isActive,
  } = req.body;

  const resident = await Resident.findOne({
    fullName: residentName.trim(),
    flatNumber: flatNumber.trim(),
  });

  const complaint = await Complaint.create({
    title: title.trim(),
    description: description.trim(),
    category,
    priority: priority || "Medium",
    status: status || "Open",
    residentName: residentName.trim(),
    residentId: resident?._id || null,
    flatNumber: flatNumber.trim(),
    assignedTo: assignedTo ? assignedTo.trim() : "",
    resolution: resolution ? resolution.trim() : "",
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    success: true,
    message: "Complaint created successfully",
    data: {
      complaint: formatComplaintResponse(complaint),
    },
  });
});

const updateComplaint = asyncHandler(async (req, res) => {
  const validationErrors = validateComplaintPayload(req.body, { partial: true });

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found",
    });
  }

  if (req.body.title !== undefined) complaint.title = req.body.title.trim();
  if (req.body.description !== undefined) complaint.description = req.body.description.trim();
  if (req.body.category !== undefined) complaint.category = req.body.category;
  if (req.body.priority !== undefined) complaint.priority = req.body.priority;
  if (req.body.status !== undefined) complaint.status = req.body.status;
  if (req.body.residentName !== undefined) complaint.residentName = req.body.residentName.trim();
  if (req.body.flatNumber !== undefined) complaint.flatNumber = req.body.flatNumber.trim();
  if (req.body.assignedTo !== undefined) complaint.assignedTo = req.body.assignedTo ? req.body.assignedTo.trim() : "";
  if (req.body.resolution !== undefined) complaint.resolution = req.body.resolution ? req.body.resolution.trim() : "";
  if (req.body.isActive !== undefined) complaint.isActive = req.body.isActive;

  const resident = await Resident.findOne({
    fullName: complaint.residentName,
    flatNumber: complaint.flatNumber,
  });

  complaint.residentId = resident?._id || null;

  const updatedComplaint = await complaint.save();

  res.status(200).json({
    success: true,
    message: "Complaint updated successfully",
    data: {
      complaint: formatComplaintResponse(updatedComplaint),
    },
  });
});

const deleteComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found",
    });
  }

  await complaint.deleteOne();

  res.status(200).json({
    success: true,
    message: "Complaint deleted successfully",
    data: null,
  });
});

module.exports = {
  listComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint,
};