const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Amenity = require("../models/Amenity");
const Resident = require("../models/Resident");
const asyncHandler = require("../utils/asyncHandler");
const { validateBookingPayload } = require("../validators/bookingValidator");

const formatBookingResponse = (booking) => ({
  id: booking._id,
  amenityId: booking.amenityId,
  amenityName: booking.amenityName,
  residentId: booking.residentId,
  residentName: booking.residentName,
  flatNumber: booking.flatNumber,
  bookingDate: booking.bookingDate,
  startTime: booking.startTime,
  endTime: booking.endTime,
  purpose: booking.purpose,
  attendees: booking.attendees,
  status: booking.status,
  notes: booking.notes,
  createdAt: booking.createdAt,
  updatedAt: booking.updatedAt,
});

const buildSearchFilter = (search) => {
  if (!search) {
    return {};
  }

  const safeSearch = search.trim();

  return {
    $or: [
      { amenityName: { $regex: safeSearch, $options: "i" } },
      { residentName: { $regex: safeSearch, $options: "i" } },
      { flatNumber: { $regex: safeSearch, $options: "i" } },
      { purpose: { $regex: safeSearch, $options: "i" } },
    ],
  };
};

const parsePagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);

  return { page, limit, skip: (page - 1) * limit };
};

const checkBookingConflict = async (amenityId, bookingDate, startTime, endTime, excludeBookingId = null) => {
  const conflictQuery = {
    amenityId,
    bookingDate,
    status: { $in: ["Pending", "Confirmed"] },
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      { startTime: { $gte: startTime, $lt: endTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
    ],
  };

  if (excludeBookingId) {
    conflictQuery._id = { $ne: excludeBookingId };
  }

  const conflict = await Booking.findOne(conflictQuery);
  return conflict;
};

const listBookings = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const searchFilter = buildSearchFilter(req.query.search);
  const statusFilter = {};
  const amenityFilter = {};
  const dateFilter = {};

  if (req.query.status) {
    statusFilter.status = req.query.status;
  }

  if (req.query.amenityId) {
    amenityFilter.amenityId = req.query.amenityId;
  }

  if (req.query.date) {
    dateFilter.bookingDate = new Date(req.query.date);
  }

  const filter = {
    ...statusFilter,
    ...amenityFilter,
    ...dateFilter,
    ...searchFilter,
  };

  const [bookings, total] = await Promise.all([
    Booking.find(filter).sort({ bookingDate: -1, startTime: -1 }).skip(skip).limit(limit),
    Booking.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Bookings fetched successfully",
    data: {
      bookings: bookings.map(formatBookingResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Booking fetched successfully",
    data: {
      booking: formatBookingResponse(booking),
    },
  });
});

const createBooking = asyncHandler(async (req, res) => {
  const validationErrors = validateBookingPayload(req.body);

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  const {
    amenityId,
    residentId,
    bookingDate,
    startTime,
    endTime,
    purpose,
    attendees,
    notes,
  } = req.body;

  // Validate amenity exists and is active
  const amenity = await Amenity.findById(amenityId);

  if (!amenity) {
    return res.status(404).json({
      success: false,
      message: "Amenity not found",
    });
  }

  if (!amenity.isActive) {
    return res.status(400).json({
      success: false,
      message: "Amenity is not available for booking",
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

  // Check for booking conflicts
  const conflict = await checkBookingConflict(amenityId, bookingDate, startTime, endTime);

  if (conflict) {
    return res.status(409).json({
      success: false,
      message: "This time slot is already booked for the selected amenity",
    });
  }

  // Validate capacity
  if (attendees > amenity.capacity) {
    return res.status(400).json({
      success: false,
      message: `Maximum capacity for this amenity is ${amenity.capacity}`,
    });
  }

  const booking = await Booking.create({
    amenityId,
    residentId,
    bookingDate: new Date(bookingDate),
    startTime,
    endTime,
    purpose: purpose?.trim() || "",
    attendees: attendees || 1,
    status: amenity.requiresApproval ? "Pending" : "Confirmed",
    notes: notes?.trim() || "",
    amenityName: amenity.name,
    residentName: resident.fullName,
    flatNumber: resident.flatNumber,
  });

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: {
      booking: formatBookingResponse(booking),
    },
  });
});

const updateBooking = asyncHandler(async (req, res) => {
  const validationErrors = validateBookingPayload(req.body, { partial: true });

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  // If changing time slot, check for conflicts
  if (req.body.bookingDate || req.body.startTime || req.body.endTime) {
    const newBookingDate = req.body.bookingDate || booking.bookingDate;
    const newStartTime = req.body.startTime || booking.startTime;
    const newEndTime = req.body.endTime || booking.endTime;

    const conflict = await checkBookingConflict(
      booking.amenityId,
      newBookingDate,
      newStartTime,
      newEndTime,
      booking._id
    );

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked for the selected amenity",
      });
    }
  }

  // If changing amenity, validate exists and check capacity
  if (req.body.amenityId && req.body.amenityId !== booking.amenityId.toString()) {
    const amenity = await Amenity.findById(req.body.amenityId);

    if (!amenity) {
      return res.status(404).json({
        success: false,
        message: "Amenity not found",
      });
    }

    if (!amenity.isActive) {
      return res.status(400).json({
        success: false,
        message: "Amenity is not available for booking",
      });
    }

    if (req.body.attendees > amenity.capacity) {
      return res.status(400).json({
        success: false,
        message: `Maximum capacity for this amenity is ${amenity.capacity}`,
      });
    }

    booking.amenityId = req.body.amenityId;
    booking.amenityName = amenity.name;
  }

  // If changing resident, validate exists
  if (req.body.residentId && req.body.residentId !== booking.residentId.toString()) {
    const resident = await Resident.findById(req.body.residentId);

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found",
      });
    }

    booking.residentId = req.body.residentId;
    booking.residentName = resident.fullName;
    booking.flatNumber = resident.flatNumber;
  }

  // Update other fields
  const allowedFields = [
    "bookingDate",
    "startTime",
    "endTime",
    "purpose",
    "attendees",
    "status",
    "notes",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      booking[field] = req.body[field];
    }
  });

  const updatedBooking = await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking updated successfully",
    data: {
      booking: formatBookingResponse(updatedBooking),
    },
  });
});

const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  await booking.deleteOne();

  res.status(200).json({
    success: true,
    message: "Booking deleted successfully",
    data: null,
  });
});

module.exports = {
  listBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};