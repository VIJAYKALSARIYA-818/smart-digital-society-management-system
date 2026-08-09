const mongoose = require("mongoose");
const Parking = require("../models/Parking");
const Resident = require("../models/Resident");
const asyncHandler = require("../utils/asyncHandler");
const { validateParking } = require("../validators/parkingValidator");

const formatParkingResponse = (parking) => ({
  id: parking._id,
  slotNumber: parking.slotNumber,
  vehicleType: parking.vehicleType,
  vehicleNumber: parking.vehicleNumber,
  residentId: parking.residentId,
  residentName: parking.residentName,
  flatNumber: parking.flatNumber,
  block: parking.block,
  allocatedDate: parking.allocatedDate,
  expiryDate: parking.expiryDate,
  status: parking.status,
  parkingSlotType: parking.parkingSlotType,
  contactNumber: parking.contactNumber,
  notes: parking.notes,
  isActive: parking.isActive,
  createdAt: parking.createdAt,
  updatedAt: parking.updatedAt,
});

const buildSearchFilter = (search) => {
  if (!search) {
    return {};
  }

  const safeSearch = search.trim();

  return {
    $or: [
      { slotNumber: { $regex: safeSearch, $options: "i" } },
      { vehicleNumber: { $regex: safeSearch, $options: "i" } },
      { residentName: { $regex: safeSearch, $options: "i" } },
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

// CREATE PARKING
const createParking = asyncHandler(async (req, res) => {
  const validation = validateParking(req.body);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.errors,
    });
  }

  const {
    slotNumber,
    vehicleType,
    vehicleNumber,
    residentId,
    allocatedDate,
    expiryDate,
    status,
    parkingSlotType,
    contactNumber,
    notes,
    isActive,
  } = req.body;

  // Check duplicate slot number
  const existingSlot = await Parking.findOne({ slotNumber });

  if (existingSlot) {
    return res.status(409).json({
      success: false,
      message: "Parking slot already exists with this slot number",
    });
  }

  // Validate resident exists
  const resident = await Resident.findById(residentId);

  if (!resident) {
    return res.status(404).json({
      success: false,
      message: "Resident not found",
    });
  }

  const parking = await Parking.create({
    slotNumber,
    vehicleType,
    vehicleNumber,
    residentId,
    residentName: resident.fullName,
    flatNumber: resident.flatNumber,
    block: resident.block,
    allocatedDate,
    expiryDate,
    status,
    parkingSlotType,
    contactNumber,
    notes,
    isActive,
  });

  res.status(201).json({
    success: true,
    message: "Parking slot created successfully",
    data: {
      parking: formatParkingResponse(parking),
    },
  });
});

// GET ALL PARKING
const listParking = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const searchFilter = buildSearchFilter(req.query.search);
  const statusFilter = {};
  const parkingSlotTypeFilter = {};

  if (req.query.status) {
    statusFilter.status = req.query.status;
  }

  if (req.query.parkingSlotType) {
    parkingSlotTypeFilter.parkingSlotType = req.query.parkingSlotType;
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
    ...parkingSlotTypeFilter,
    ...searchFilter,
  };

  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
  const sortObject = { [sortBy]: sortOrder };

  const [parking, total] = await Promise.all([
    Parking.find(filter).sort(sortObject).skip(skip).limit(limit),
    Parking.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Parking slots fetched successfully",
    data: {
      parking: parking.map(formatParkingResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

// GET PARKING BY ID
const getParkingById = asyncHandler(async (req, res) => {
  const parking = await Parking.findById(req.params.id);

  if (!parking) {
    return res.status(404).json({
      success: false,
      message: "Parking slot not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Parking slot fetched successfully",
    data: {
      parking: formatParkingResponse(parking),
    },
  });
});

// UPDATE PARKING
const updateParking = asyncHandler(async (req, res) => {
  const validation = validateParking(req.body);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.errors,
    });
  }

  const parking = await Parking.findById(req.params.id);

  if (!parking) {
    return res.status(404).json({
      success: false,
      message: "Parking slot not found",
    });
  }

  // Prevent duplicate slot number
  if (req.body.slotNumber && req.body.slotNumber !== parking.slotNumber) {
    const existingSlot = await Parking.findOne({
      slotNumber: req.body.slotNumber,
      _id: { $ne: req.params.id },
    });

    if (existingSlot) {
      return res.status(409).json({
        success: false,
        message: "Parking slot already exists with this slot number",
      });
    }
  }

  // If residentId is being changed, validate and update denormalized fields
  if (req.body.residentId && req.body.residentId !== parking.residentId.toString()) {
    const resident = await Resident.findById(req.body.residentId);

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found",
      });
    }

    parking.residentId = req.body.residentId;
    parking.residentName = resident.fullName;
    parking.flatNumber = resident.flatNumber;
    parking.block = resident.block;
  }

  // Update other fields
  const allowedFields = [
    "slotNumber",
    "vehicleType",
    "vehicleNumber",
    "allocatedDate",
    "expiryDate",
    "status",
    "parkingSlotType",
    "contactNumber",
    "notes",
    "isActive",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      parking[field] = req.body[field];
    }
  });

  const updatedParking = await parking.save();

  res.status(200).json({
    success: true,
    message: "Parking slot updated successfully",
    data: {
      parking: formatParkingResponse(updatedParking),
    },
  });
});

// DELETE PARKING
const deleteParking = asyncHandler(async (req, res) => {
  const parking = await Parking.findById(req.params.id);

  if (!parking) {
    return res.status(404).json({
      success: false,
      message: "Parking slot not found",
    });
  }

  await parking.deleteOne();

  res.status(200).json({
    success: true,
    message: "Parking slot deleted successfully",
    data: null,
  });
});

module.exports = {
    createParking,
    deleteParking,
    getParkingById,
    listParking,
    updateParking,
};