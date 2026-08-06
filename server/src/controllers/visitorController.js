const Visitor = require("../models/Visitor");
const asyncHandler = require("../utils/asyncHandler");
const {
  normalizeString,
  validateVisitorPayload,
} = require("../validators/visitorValidator");

const formatVisitorResponse = (visitor) => ({
  id: visitor._id,
  fullName: visitor.fullName,
  phone: visitor.phone,
  email: visitor.email,
  purpose: visitor.purpose,
  residentName: visitor.residentName,
  flatNumber: visitor.flatNumber,
  block: visitor.block,
  checkInTime: visitor.checkInTime,
  checkOutTime: visitor.checkOutTime,
  status: visitor.status,
  vehicleNumber: visitor.vehicleNumber,
  idProofType: visitor.idProofType,
  idProofNumber: visitor.idProofNumber,
  notes: visitor.notes,
  isActive: visitor.isActive,
  createdAt: visitor.createdAt,
  updatedAt: visitor.updatedAt,
});

const buildSearchFilter = (search) => {
  if (!search) {
    return {};
  }

  const safeSearch = search.trim();

  return {
    $or: [
      { fullName: { $regex: safeSearch, $options: "i" } },
      { phone: { $regex: safeSearch, $options: "i" } },
      { email: { $regex: safeSearch, $options: "i" } },
      { purpose: { $regex: safeSearch, $options: "i" } },
      { residentName: { $regex: safeSearch, $options: "i" } },
      { flatNumber: { $regex: safeSearch, $options: "i" } },
      { block: { $regex: safeSearch, $options: "i" } },
      { vehicleNumber: { $regex: safeSearch, $options: "i" } },
      { idProofType: { $regex: safeSearch, $options: "i" } },
      { idProofNumber: { $regex: safeSearch, $options: "i" } },
      { notes: { $regex: safeSearch, $options: "i" } },
    ],
  };
};

const parsePagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);

  return { page, limit, skip: (page - 1) * limit };
};

const parseSort = (query) => {
  const allowedFields = new Set([
    "createdAt",
    "checkInTime",
    "checkOutTime",
    "fullName",
    "flatNumber",
    "status",
  ]);
  const sortBy = allowedFields.has(query.sortBy) ? query.sortBy : "checkInTime";
  const sortOrder = query.sortOrder === "asc" ? 1 : -1;

  return { [sortBy]: sortOrder, createdAt: -1 };
};

const listVisitors = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const searchFilter = buildSearchFilter(req.query.search);
  const statusFilter = {};

  if (req.query.status && ["Inside", "Exited"].includes(req.query.status)) {
    statusFilter.status = req.query.status;
  }

  if (req.query.isActive !== undefined) {
    if (req.query.isActive === "true") {
      statusFilter.isActive = true;
    } else if (req.query.isActive === "false") {
      statusFilter.isActive = false;
    }
  }

  const filter = {
    ...statusFilter,
    ...searchFilter,
  };

  const sort = parseSort(req.query);

  const [visitors, total] = await Promise.all([
    Visitor.find(filter).sort(sort).skip(skip).limit(limit),
    Visitor.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Visitors fetched successfully",
    data: {
      visitors: visitors.map(formatVisitorResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

const getVisitorById = asyncHandler(async (req, res) => {
  const visitor = await Visitor.findById(req.params.id);

  if (!visitor) {
    return res.status(404).json({
      success: false,
      message: "Visitor not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Visitor fetched successfully",
    data: {
      visitor: formatVisitorResponse(visitor),
    },
  });
});

const createVisitor = asyncHandler(async (req, res) => {
  const validationErrors = validateVisitorPayload(req.body);

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  const {
    fullName,
    phone,
    email,
    purpose,
    residentName,
    flatNumber,
    block,
    checkInTime,
    vehicleNumber,
    idProofType,
    idProofNumber,
    notes,
    isActive,
  } = req.body;

  const visitor = await Visitor.create({
    fullName: fullName.trim(),
    phone: phone.trim(),
    email: normalizeString(email).toLowerCase(),
    purpose: purpose.trim(),
    residentName: residentName.trim(),
    flatNumber: flatNumber.trim(),
    block: block.trim(),
    checkInTime: checkInTime || new Date(),
    checkOutTime: null,
    status: "Inside",
    vehicleNumber: normalizeString(vehicleNumber),
    idProofType: normalizeString(idProofType),
    idProofNumber: normalizeString(idProofNumber),
    notes: normalizeString(notes),
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    success: true,
    message: "Visitor created successfully",
    data: {
      visitor: formatVisitorResponse(visitor),
    },
  });
});

const updateVisitor = asyncHandler(async (req, res) => {
  const validationErrors = validateVisitorPayload(req.body, { partial: true });

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  const visitor = await Visitor.findById(req.params.id);

  if (!visitor) {
    return res.status(404).json({
      success: false,
      message: "Visitor not found",
    });
  }

  if (req.body.fullName !== undefined) visitor.fullName = req.body.fullName.trim();
  if (req.body.phone !== undefined) visitor.phone = req.body.phone.trim();
  if (req.body.email !== undefined) visitor.email = normalizeString(req.body.email).toLowerCase();
  if (req.body.purpose !== undefined) visitor.purpose = req.body.purpose.trim();
  if (req.body.residentName !== undefined) visitor.residentName = req.body.residentName.trim();
  if (req.body.flatNumber !== undefined) visitor.flatNumber = req.body.flatNumber.trim();
  if (req.body.block !== undefined) visitor.block = req.body.block.trim();
  if (req.body.checkInTime !== undefined) visitor.checkInTime = req.body.checkInTime || null;
  if (req.body.checkOutTime !== undefined) visitor.checkOutTime = req.body.checkOutTime || null;
  if (req.body.status !== undefined) visitor.status = req.body.status;
  if (req.body.vehicleNumber !== undefined) visitor.vehicleNumber = normalizeString(req.body.vehicleNumber);
  if (req.body.idProofType !== undefined) visitor.idProofType = normalizeString(req.body.idProofType);
  if (req.body.idProofNumber !== undefined) visitor.idProofNumber = normalizeString(req.body.idProofNumber);
  if (req.body.notes !== undefined) visitor.notes = normalizeString(req.body.notes);
  if (req.body.isActive !== undefined) visitor.isActive = req.body.isActive;

  const updatedVisitor = await visitor.save();

  res.status(200).json({
    success: true,
    message: "Visitor updated successfully",
    data: {
      visitor: formatVisitorResponse(updatedVisitor),
    },
  });
});

const deleteVisitor = asyncHandler(async (req, res) => {
  const visitor = await Visitor.findById(req.params.id);

  if (!visitor) {
    return res.status(404).json({
      success: false,
      message: "Visitor not found",
    });
  }

  await visitor.deleteOne();

  res.status(200).json({
    success: true,
    message: "Visitor deleted successfully",
    data: null,
  });
});

const checkInVisitor = asyncHandler(async (req, res) => {
  const visitor = await Visitor.findById(req.params.id);

  if (!visitor) {
    return res.status(404).json({
      success: false,
      message: "Visitor not found",
    });
  }

  visitor.status = "Inside";
  visitor.checkInTime = new Date();
  visitor.checkOutTime = null;

  const updatedVisitor = await visitor.save();

  res.status(200).json({
    success: true,
    message: "Visitor checked in successfully",
    data: {
      visitor: formatVisitorResponse(updatedVisitor),
    },
  });
});

const checkOutVisitor = asyncHandler(async (req, res) => {
  const visitor = await Visitor.findById(req.params.id);

  if (!visitor) {
    return res.status(404).json({
      success: false,
      message: "Visitor not found",
    });
  }

  visitor.status = "Exited";
  visitor.checkOutTime = new Date();

  const updatedVisitor = await visitor.save();

  res.status(200).json({
    success: true,
    message: "Visitor checked out successfully",
    data: {
      visitor: formatVisitorResponse(updatedVisitor),
    },
  });
});

module.exports = {
  listVisitors,
  getVisitorById,
  createVisitor,
  updateVisitor,
  deleteVisitor,
  checkInVisitor,
  checkOutVisitor,
};