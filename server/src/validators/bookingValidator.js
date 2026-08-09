const BOOKING_STATUSES = ["Pending", "Confirmed", "Cancelled", "Completed", "Rejected"];

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const isValidDateString = (value) => {
  if (!isNonEmptyString(value)) {
    return false;
  }
  return !Number.isNaN(Date.parse(value));
};

const validateBookingPayload = (body, { partial = false } = {}) => {
  const errors = [];
  const {
    amenityId,
    residentId,
    bookingDate,
    startTime,
    endTime,
    purpose,
    attendees,
    status,
    notes,
  } = body;

  if (!partial || amenityId !== undefined) {
    if (!amenityId) {
      errors.push("Amenity is required");
    }
  }

  if (!partial || residentId !== undefined) {
    if (!residentId) {
      errors.push("Resident is required");
    }
  }

  if (!partial || bookingDate !== undefined) {
    if (!isValidDateString(bookingDate)) {
      errors.push("Valid booking date is required");
    }
  }

  if (!partial || startTime !== undefined) {
    if (!isNonEmptyString(startTime)) {
      errors.push("Start time is required");
    }
  }

  if (!partial || endTime !== undefined) {
    if (!isNonEmptyString(endTime)) {
      errors.push("End time is required");
    }
  }

  if (startTime && endTime && startTime >= endTime) {
    errors.push("End time must be after start time");
  }

  if (attendees !== undefined && (typeof attendees !== "number" || attendees < 1)) {
    errors.push("Attendees must be at least 1");
  }

  if (status !== undefined && !BOOKING_STATUSES.includes(status)) {
    errors.push("Invalid booking status");
  }

  if (notes !== undefined && notes !== null && typeof notes !== "string") {
    errors.push("Notes must be a string");
  }

  return errors;
};

module.exports = {
  BOOKING_STATUSES,
  validateBookingPayload,
};