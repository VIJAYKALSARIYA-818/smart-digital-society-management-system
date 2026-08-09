const Amenity = require("../models/Amenity");
const asyncHandler = require("../utils/asyncHandler");
const { validateAmenityPayload } = require("../validators/amenityValidator");

const formatAmenityResponse = (amenity) => ({
  id: amenity._id,
  name: amenity.name,
  description: amenity.description,
  type: amenity.type,
  capacity: amenity.capacity,
  location: amenity.location,
  facilities: amenity.facilities,
  operatingHours: amenity.operatingHours,
  bookingFee: amenity.bookingFee,
  requiresApproval: amenity.requiresApproval,
  isActive: amenity.isActive,
  createdAt: amenity.createdAt,
  updatedAt: amenity.updatedAt,
});

const buildSearchFilter = (search) => {
  if (!search) {
    return {};
  }

  const safeSearch = search.trim();

  return {
    $or: [
      { name: { $regex: safeSearch, $options: "i" } },
      { description: { $regex: safeSearch, $options: "i" } },
      { type: { $regex: safeSearch, $options: "i" } },
      { location: { $regex: safeSearch, $options: "i" } },
    ],
  };
};

const parsePagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);

  return { page, limit, skip: (page - 1) * limit };
};

const listAmenities = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const searchFilter = buildSearchFilter(req.query.search);
  const typeFilter = {};
  const statusFilter = {};

  if (req.query.type) {
    typeFilter.type = req.query.type;
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
    ...typeFilter,
    ...searchFilter,
  };

  const [amenities, total] = await Promise.all([
    Amenity.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Amenity.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Amenities fetched successfully",
    data: {
      amenities: amenities.map(formatAmenityResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

const getAmenityById = asyncHandler(async (req, res) => {
  const amenity = await Amenity.findById(req.params.id);

  if (!amenity) {
    return res.status(404).json({
      success: false,
      message: "Amenity not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Amenity fetched successfully",
    data: {
      amenity: formatAmenityResponse(amenity),
    },
  });
});

const createAmenity = asyncHandler(async (req, res) => {
  const validationErrors = validateAmenityPayload(req.body);

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  const {
    name,
    description,
    type,
    capacity,
    location,
    facilities,
    operatingHours,
    bookingFee,
    requiresApproval,
    isActive,
  } = req.body;

  const amenity = await Amenity.create({
    name: name.trim(),
    description: description?.trim() || "",
    type: type || "Other",
    capacity: capacity || 1,
    location: location?.trim() || "",
    facilities: facilities || [],
    operatingHours: operatingHours?.trim() || "",
    bookingFee: bookingFee || 0,
    requiresApproval: requiresApproval || false,
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    success: true,
    message: "Amenity created successfully",
    data: {
      amenity: formatAmenityResponse(amenity),
    },
  });
});

const updateAmenity = asyncHandler(async (req, res) => {
  const validationErrors = validateAmenityPayload(req.body, { partial: true });

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  const amenity = await Amenity.findById(req.params.id);

  if (!amenity) {
    return res.status(404).json({
      success: false,
      message: "Amenity not found",
    });
  }

  const updateFields = {
    name: req.body.name !== undefined ? req.body.name.trim() : amenity.name,
    description: req.body.description !== undefined ? req.body.description.trim() : amenity.description,
    type: req.body.type || amenity.type,
    capacity: req.body.capacity !== undefined ? req.body.capacity : amenity.capacity,
    location: req.body.location !== undefined ? req.body.location.trim() : amenity.location,
    facilities: req.body.facilities !== undefined ? req.body.facilities : amenity.facilities,
    operatingHours: req.body.operatingHours !== undefined ? req.body.operatingHours.trim() : amenity.operatingHours,
    bookingFee: req.body.bookingFee !== undefined ? req.body.bookingFee : amenity.bookingFee,
    requiresApproval: req.body.requiresApproval !== undefined ? req.body.requiresApproval : amenity.requiresApproval,
    isActive: req.body.isActive !== undefined ? req.body.isActive : amenity.isActive,
  };

  Object.assign(amenity, updateFields);

  const updatedAmenity = await amenity.save();

  res.status(200).json({
    success: true,
    message: "Amenity updated successfully",
    data: {
      amenity: formatAmenityResponse(updatedAmenity),
    },
  });
});

const deleteAmenity = asyncHandler(async (req, res) => {
  const amenity = await Amenity.findById(req.params.id);

  if (!amenity) {
    return res.status(404).json({
      success: false,
      message: "Amenity not found",
    });
  }

  await amenity.deleteOne();

  res.status(200).json({
    success: true,
    message: "Amenity deleted successfully",
    data: null,
  });
});

module.exports = {
  listAmenities,
  getAmenityById,
  createAmenity,
  updateAmenity,
  deleteAmenity,
};