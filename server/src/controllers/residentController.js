const Resident = require("../models/Resident");
const asyncHandler = require("../utils/asyncHandler");
const { validateResidentPayload } = require("../validators/residentValidator");

const formatResidentResponse = (resident) => ({
  id: resident._id,
  fullName: resident.fullName,
  email: resident.email,
  phone: resident.phone,
  flatNumber: resident.flatNumber,
  block: resident.block,
  residentType: resident.residentType,
  moveInDate: resident.moveInDate,
  profileImage: resident.profileImage,
  notes: resident.notes,
  isActive: resident.isActive,
  createdAt: resident.createdAt,
  updatedAt: resident.updatedAt,
});

const buildSearchFilter = (search) => {
  if (!search) {
    return {};
  }

  const safeSearch = search.trim();

  return {
    $or: [
      { fullName: { $regex: safeSearch, $options: "i" } },
      { email: { $regex: safeSearch, $options: "i" } },
      { phone: { $regex: safeSearch, $options: "i" } },
      { flatNumber: { $regex: safeSearch, $options: "i" } },
      { block: { $regex: safeSearch, $options: "i" } },
    ],
  };
};

const parsePagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);

  return { page, limit, skip: (page - 1) * limit };
};

const listResidents = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const searchFilter = buildSearchFilter(req.query.search);
  const statusFilter = {};

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

  const [residents, total] = await Promise.all([
    Resident.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Resident.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Residents fetched successfully",
    data: {
      residents: residents.map(formatResidentResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

const getResidentById = asyncHandler(async (req, res) => {
  const resident = await Resident.findById(req.params.id);

  if (!resident) {
    return res.status(404).json({
      success: false,
      message: "Resident not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Resident fetched successfully",
    data: {
      resident: formatResidentResponse(resident),
    },
  });
});

const createResident = asyncHandler(async (req, res) => {
  const validationErrors = validateResidentPayload(req.body);

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  const {
    fullName,
    email,
    phone,
    flatNumber,
    block,
    residentType,
    moveInDate,
    profileImage,
    notes,
    isActive,
  } = req.body;

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedFlatNumber = flatNumber.trim();

  const [existingEmail, existingFlatNumber] = await Promise.all([
    Resident.findOne({ email: normalizedEmail }),
    Resident.findOne({ flatNumber: normalizedFlatNumber }),
  ]);

  if (existingEmail) {
    return res.status(409).json({
      success: false,
      message: "Resident already exists with this email",
    });
  }

  if (existingFlatNumber) {
    return res.status(409).json({
      success: false,
      message: "Resident already exists with this flat number",
    });
  }

  const resident = await Resident.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    flatNumber: normalizedFlatNumber,
    block: block ? block.trim() : "",
    residentType: residentType || "Owner",
    moveInDate: moveInDate || null,
    profileImage: profileImage || "",
    notes: notes || "",
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    success: true,
    message: "Resident created successfully",
    data: {
      resident: formatResidentResponse(resident),
    },
  });
});

const updateResident = asyncHandler(async (req, res) => {
  const validationErrors = validateResidentPayload(req.body, { partial: true });

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  const resident = await Resident.findById(req.params.id);

  if (!resident) {
    return res.status(404).json({
      success: false,
      message: "Resident not found",
    });
  }

  const nextEmail = req.body.email ? req.body.email.trim().toLowerCase() : null;
  const nextFlatNumber = req.body.flatNumber ? req.body.flatNumber.trim() : null;

  if (nextEmail && nextEmail !== resident.email) {
    const existingEmail = await Resident.findOne({ email: nextEmail });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Resident already exists with this email",
      });
    }
  }

  if (nextFlatNumber && nextFlatNumber !== resident.flatNumber) {
    const existingFlatNumber = await Resident.findOne({ flatNumber: nextFlatNumber });

    if (existingFlatNumber) {
      return res.status(409).json({
        success: false,
        message: "Resident already exists with this flat number",
      });
    }
  }

  const updateFields = {
    fullName: req.body.fullName !== undefined ? req.body.fullName.trim() : resident.fullName,
    email: nextEmail || resident.email,
    phone: req.body.phone !== undefined ? req.body.phone.trim() : resident.phone,
    flatNumber: nextFlatNumber || resident.flatNumber,
    block: req.body.block !== undefined ? req.body.block.trim() : resident.block,
    residentType: req.body.residentType || resident.residentType,
    moveInDate: req.body.moveInDate !== undefined ? (req.body.moveInDate || null) : resident.moveInDate,
    profileImage: req.body.profileImage !== undefined ? req.body.profileImage : resident.profileImage,
    notes: req.body.notes !== undefined ? req.body.notes : resident.notes,
    isActive: req.body.isActive !== undefined ? req.body.isActive : resident.isActive,
  };

  Object.assign(resident, updateFields);

  const updatedResident = await resident.save();

  res.status(200).json({
    success: true,
    message: "Resident updated successfully",
    data: {
      resident: formatResidentResponse(updatedResident),
    },
  });
});

const deleteResident = asyncHandler(async (req, res) => {
  const resident = await Resident.findById(req.params.id);

  if (!resident) {
    return res.status(404).json({
      success: false,
      message: "Resident not found",
    });
  }

  await resident.deleteOne();

  res.status(200).json({
    success: true,
    message: "Resident deleted successfully",
    data: null,
  });
});

module.exports = {
  listResidents,
  getResidentById,
  createResident,
  updateResident,
  deleteResident,
};