const mongoose = require("mongoose");
const Package = require("../models/Package");
const Resident = require("../models/Resident");
const asyncHandler = require("../utils/asyncHandler");
const { validatePackagePayload } = require("../validators/packageValidator");

const formatPackageResponse = (pkg) => ({
  id: pkg._id,
  trackingNumber: pkg.trackingNumber,
  residentId: pkg.residentId,
  residentName: pkg.residentName,
  flatNumber: pkg.flatNumber,
  block: pkg.block,
  courier: pkg.courier,
  senderName: pkg.senderName,
  senderContact: pkg.senderContact,
  packageType: pkg.packageType,
  description: pkg.description,
  expectedDeliveryDate: pkg.expectedDeliveryDate,
  actualDeliveryDate: pkg.actualDeliveryDate,
  receivedDate: pkg.receivedDate,
  status: pkg.status,
  deliveryPersonName: pkg.deliveryPersonName,
  deliveryPersonContact: pkg.deliveryPersonContact,
  notes: pkg.notes,
  isActive: pkg.isActive,
  createdAt: pkg.createdAt,
  updatedAt: pkg.updatedAt,
});

const buildSearchFilter = (search) => {
  if (!search) {
    return {};
  }

  const safeSearch = search.trim();

  return {
    $or: [
      { trackingNumber: { $regex: safeSearch, $options: "i" } },
      { residentName: { $regex: safeSearch, $options: "i" } },
      { flatNumber: { $regex: safeSearch, $options: "i" } },
      { block: { $regex: safeSearch, $options: "i" } },
      { courier: { $regex: safeSearch, $options: "i" } },
      { senderName: { $regex: safeSearch, $options: "i" } },
    ],
  };
};

const parsePagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);

  return { page, limit, skip: (page - 1) * limit };
};

const listPackages = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const searchFilter = buildSearchFilter(req.query.search);
  const statusFilter = {};
  const packageTypeFilter = {};
  const activeFilter = {};

  if (req.query.status) {
    statusFilter.status = req.query.status;
  }

  if (req.query.packageType) {
    packageTypeFilter.packageType = req.query.packageType;
  }

  if (req.query.isActive !== undefined) {
    if (req.query.isActive === "true") {
      activeFilter.isActive = true;
    } else if (req.query.isActive === "false") {
      activeFilter.isActive = false;
    }
  }

  const filter = {
    ...statusFilter,
    ...packageTypeFilter,
    ...activeFilter,
    ...searchFilter,
  };

  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

  const [packages, total] = await Promise.all([
    Package.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    Package.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Packages fetched successfully",
    data: {
      packages: packages.map(formatPackageResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

const getPackageById = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);

  if (!pkg) {
    return res.status(404).json({
      success: false,
      message: "Package not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Package fetched successfully",
    data: {
      package: formatPackageResponse(pkg),
    },
  });
});

const createPackage = asyncHandler(async (req, res) => {
  const validationErrors = validatePackagePayload(req.body);

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  const {
    trackingNumber,
    residentId,
    courier,
    senderName,
    senderContact,
    packageType,
    description,
    expectedDeliveryDate,
    actualDeliveryDate,
    receivedDate,
    status,
    deliveryPersonName,
    deliveryPersonContact,
    notes,
    isActive,
  } = req.body;

  // Check if tracking number already exists
  const existingPackage = await Package.findOne({ trackingNumber: trackingNumber.trim() });
  if (existingPackage) {
    return res.status(409).json({
      success: false,
      message: "A package with this tracking number already exists",
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

  const pkg = await Package.create({
    trackingNumber: trackingNumber.trim(),
    residentId,
    residentName: resident.fullName,
    flatNumber: resident.flatNumber,
    block: resident.block || "",
    courier: courier.trim(),
    senderName: senderName.trim(),
    senderContact: senderContact?.trim() || "",
    packageType: packageType || "Other",
    description: description?.trim() || "",
    expectedDeliveryDate: new Date(expectedDeliveryDate),
    actualDeliveryDate: actualDeliveryDate ? new Date(actualDeliveryDate) : null,
    receivedDate: receivedDate ? new Date(receivedDate) : null,
    status: status || "Expected",
    deliveryPersonName: deliveryPersonName?.trim() || "",
    deliveryPersonContact: deliveryPersonContact?.trim() || "",
    notes: notes?.trim() || "",
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    success: true,
    message: "Package created successfully",
    data: {
      package: formatPackageResponse(pkg),
    },
  });
});

const updatePackage = asyncHandler(async (req, res) => {
  const validationErrors = validatePackagePayload(req.body, { partial: true });

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  const pkg = await Package.findById(req.params.id);

  if (!pkg) {
    return res.status(404).json({
      success: false,
      message: "Package not found",
    });
  }

  // If changing tracking number, check for duplicates
  if (req.body.trackingNumber && req.body.trackingNumber !== pkg.trackingNumber) {
    const existingPackage = await Package.findOne({
      trackingNumber: req.body.trackingNumber.trim(),
      _id: { $ne: pkg._id },
    });

    if (existingPackage) {
      return res.status(409).json({
        success: false,
        message: "A package with this tracking number already exists",
      });
    }
  }

  // If changing resident, validate exists and update denormalized fields
  if (req.body.residentId && req.body.residentId !== pkg.residentId.toString()) {
    const resident = await Resident.findById(req.body.residentId);

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found",
      });
    }

    pkg.residentId = req.body.residentId;
    pkg.residentName = resident.fullName;
    pkg.flatNumber = resident.flatNumber;
    pkg.block = resident.block || "";
  }

  // Update other fields
  const allowedFields = [
    "trackingNumber",
    "courier",
    "senderName",
    "senderContact",
    "packageType",
    "description",
    "expectedDeliveryDate",
    "actualDeliveryDate",
    "receivedDate",
    "status",
    "deliveryPersonName",
    "deliveryPersonContact",
    "notes",
    "isActive",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      if (field.includes("Date") && req.body[field]) {
        pkg[field] = new Date(req.body[field]);
      } else if (field === "trackingNumber" || field === "courier" || field === "senderName") {
        pkg[field] = req.body[field].trim();
      } else if (typeof req.body[field] === "string") {
        pkg[field] = req.body[field].trim();
      } else {
        pkg[field] = req.body[field];
      }
    }
  });

  const updatedPackage = await pkg.save();

  res.status(200).json({
    success: true,
    message: "Package updated successfully",
    data: {
      package: formatPackageResponse(updatedPackage),
    },
  });
});

const deletePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);

  if (!pkg) {
    return res.status(404).json({
      success: false,
      message: "Package not found",
    });
  }

  await pkg.deleteOne();

  res.status(200).json({
    success: true,
    message: "Package deleted successfully",
    data: null,
  });
});

module.exports = {
  listPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
};