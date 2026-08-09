const AMENITY_TYPES = ["Sports", "Recreation", "Community", "Service", "Other"];

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const validateAmenityPayload = (body, { partial = false } = {}) => {
  const errors = [];
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
  } = body;

  if (!partial || name !== undefined) {
    if (!isNonEmptyString(name)) {
      errors.push("Amenity name is required");
    }
  }

  if (type !== undefined && !AMENITY_TYPES.includes(type)) {
    errors.push("Invalid amenity type");
  }

  if (capacity !== undefined && (typeof capacity !== "number" || capacity < 1)) {
    errors.push("Capacity must be at least 1");
  }

  if (location !== undefined && location !== null && typeof location !== "string") {
    errors.push("Location must be a string");
  }

  if (facilities !== undefined && !Array.isArray(facilities)) {
    errors.push("Facilities must be an array");
  }

  if (operatingHours !== undefined && operatingHours !== null && typeof operatingHours !== "string") {
    errors.push("Operating hours must be a string");
  }

  if (bookingFee !== undefined && (typeof bookingFee !== "number" || bookingFee < 0)) {
    errors.push("Booking fee cannot be negative");
  }

  if (requiresApproval !== undefined && typeof requiresApproval !== "boolean") {
    errors.push("requiresApproval must be a boolean value");
  }

  if (isActive !== undefined && typeof isActive !== "boolean") {
    errors.push("isActive must be a boolean value");
  }

  return errors;
};

module.exports = {
  AMENITY_TYPES,
  validateAmenityPayload,
};