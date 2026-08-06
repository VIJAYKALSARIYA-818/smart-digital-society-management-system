const VISITOR_STATUSES = ["Inside", "Exited"];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const isValidDateString = (value) => {
  if (!isNonEmptyString(value)) {
    return false;
  }

  return !Number.isNaN(Date.parse(value));
};

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "");

const validateVisitorPayload = (body, { partial = false } = {}) => {
  const errors = [];
  const {
    fullName,
    phone,
    email,
    purpose,
    residentName,
    flatNumber,
    block,
    checkInTime,
    checkOutTime,
    status,
    vehicleNumber,
    idProofType,
    idProofNumber,
    notes,
    isActive,
  } = body;

  if (!partial || fullName !== undefined) {
    if (!isNonEmptyString(fullName)) {
      errors.push("Full name is required");
    } else if (fullName.trim().length < 2) {
      errors.push("Full name must be at least 2 characters");
    }
  }

  if (!partial || phone !== undefined) {
    if (!isNonEmptyString(phone)) {
      errors.push("Phone number is required");
    }
  }

  if (email !== undefined && email !== null && email !== "" && !EMAIL_REGEX.test(email.trim())) {
    errors.push("Please provide a valid email address");
  }

  if (!partial || purpose !== undefined) {
    if (!isNonEmptyString(purpose)) {
      errors.push("Purpose is required");
    }
  }

  if (!partial || residentName !== undefined) {
    if (!isNonEmptyString(residentName)) {
      errors.push("Resident name is required");
    }
  }

  if (!partial || flatNumber !== undefined) {
    if (!isNonEmptyString(flatNumber)) {
      errors.push("Flat number is required");
    }
  }

  if (!partial || block !== undefined) {
    if (!isNonEmptyString(block)) {
      errors.push("Block is required");
    }
  }

  if (checkInTime !== undefined && checkInTime !== null && checkInTime !== "" && !isValidDateString(checkInTime)) {
    errors.push("Check-in time must be a valid date");
  }

  if (checkOutTime !== undefined && checkOutTime !== null && checkOutTime !== "" && !isValidDateString(checkOutTime)) {
    errors.push("Check-out time must be a valid date");
  }

  if (status !== undefined && !VISITOR_STATUSES.includes(status)) {
    errors.push("Status is invalid");
  }

  if (vehicleNumber !== undefined && vehicleNumber !== null && typeof vehicleNumber !== "string") {
    errors.push("Vehicle number must be a string");
  }

  if (idProofType !== undefined && idProofType !== null && typeof idProofType !== "string") {
    errors.push("ID proof type must be a string");
  }

  if (idProofNumber !== undefined && idProofNumber !== null && typeof idProofNumber !== "string") {
    errors.push("ID proof number must be a string");
  }

  if (notes !== undefined && notes !== null && typeof notes !== "string") {
    errors.push("Notes must be a string");
  }

  if (isActive !== undefined && typeof isActive !== "boolean") {
    errors.push("isActive must be a boolean value");
  }

  return errors;
};

module.exports = {
  VISITOR_STATUSES,
  validateVisitorPayload,
  normalizeString,
};