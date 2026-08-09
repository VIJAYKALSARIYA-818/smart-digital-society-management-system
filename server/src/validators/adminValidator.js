const { USER_ROLES } = require("../validators/authValidator");

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const validateUserUpdate = (body, { partial = false } = {}) => {
  const errors = [];
  const {
    fullName,
    email,
    phone,
    flatNumber,
    role,
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
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.push("Please provide a valid email address");
    }
  }

  if (!partial || phone !== undefined) {
    if (!isNonEmptyString(phone)) {
      errors.push("Phone number is required");
    } else if (!/^[+]?[\d\s-]{10,15}$/.test(phone.trim())) {
      errors.push("Please provide a valid phone number");
    }
  }

  if (!partial || flatNumber !== undefined) {
    if (!isNonEmptyString(flatNumber)) {
      errors.push("Flat number is required");
    }
  }

  if (role !== undefined && !USER_ROLES.includes(role)) {
    errors.push(`Invalid role. Must be one of: ${USER_ROLES.join(", ")}`);
  }

  if (isActive !== undefined && typeof isActive !== "boolean") {
    errors.push("isActive must be a boolean value");
  }

  return errors;
};

const validateUserCreate = (body) => {
  const errors = [];
  const {
    fullName,
    email,
    phone,
    flatNumber,
    password,
    confirmPassword,
    role,
  } = body;

  if (!isNonEmptyString(fullName)) {
    errors.push("Full name is required");
  } else if (fullName.trim().length < 2) {
    errors.push("Full name must be at least 2 characters");
  }

  if (!isNonEmptyString(email)) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push("Please provide a valid email address");
  }

  if (!isNonEmptyString(phone)) {
    errors.push("Phone number is required");
  } else if (!/^[+]?[\d\s-]{10,15}$/.test(phone.trim())) {
    errors.push("Please provide a valid phone number");
  }

  if (!isNonEmptyString(flatNumber)) {
    errors.push("Flat number is required");
  }

  if (!isNonEmptyString(password)) {
    errors.push("Password is required");
  } else if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (!isNonEmptyString(confirmPassword)) {
    errors.push("Confirm password is required");
  } else if (password !== confirmPassword) {
    errors.push("Password and confirm password do not match");
  }

  if (role && !USER_ROLES.includes(role)) {
    errors.push(`Invalid role. Must be one of: ${USER_ROLES.join(", ")}`);
  }

  return errors;
};

module.exports = {
  validateUserUpdate,
  validateUserCreate,
  USER_ROLES,
};