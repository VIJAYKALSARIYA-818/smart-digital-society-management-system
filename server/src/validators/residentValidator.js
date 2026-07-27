const RESIDENT_TYPES = ["Owner", "Tenant", "Family Member", "Other"];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const isValidDateString = (value) => {
  if (!isNonEmptyString(value)) {
    return false;
  }

  return !Number.isNaN(Date.parse(value));
};

const validateResidentPayload = (body, { partial = false } = {}) => {
  const errors = [];
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
  } = body;

  if (!partial || fullName !== undefined) {
    if (!isNonEmptyString(fullName)) {
      errors.push("Full name is required");
    } else if (fullName.trim().length < 2) {
      errors.push("Full name must be at least 2 characters");
    }
  }

  if (!partial || email !== undefined) {
    if (!isNonEmptyString(email)) {
      errors.push("Email is required");
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.push("Please provide a valid email address");
    }
  }

  if (!partial || phone !== undefined) {
    if (!isNonEmptyString(phone)) {
      errors.push("Phone number is required");
    }
  }

  if (!partial || flatNumber !== undefined) {
    if (!isNonEmptyString(flatNumber)) {
      errors.push("Flat number is required");
    }
  }

  if (block !== undefined && block !== null && typeof block !== "string") {
    errors.push("Block must be a string");
  }

  if (residentType !== undefined && !RESIDENT_TYPES.includes(residentType)) {
    errors.push("Resident type is invalid");
  }

  if (
    moveInDate !== undefined &&
    moveInDate !== null &&
    moveInDate !== "" &&
    !isValidDateString(moveInDate)
  ) {
    errors.push("Move-in date must be a valid date");
  }

  if (profileImage !== undefined && profileImage !== null && typeof profileImage !== "string") {
    errors.push("Profile image must be a string");
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
  RESIDENT_TYPES,
  validateResidentPayload,
};