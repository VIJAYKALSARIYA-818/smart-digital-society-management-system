const USER_ROLES = ["Resident", "Society Admin", "Security Guard", "Maintenance Staff"];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s-]{10,15}$/;

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const validateRegister = (body) => {
  const errors = [];
  const {
    fullName,
    email,
    phone,
    flatNumber,
    password,
    confirmPassword,
  } = body;

  if (!isNonEmptyString(fullName)) {
    errors.push("Full name is required");
  } else if (fullName.trim().length < 2) {
    errors.push("Full name must be at least 2 characters");
  }

  if (!isNonEmptyString(email)) {
    errors.push("Email is required");
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push("Please provide a valid email address");
  }

  if (!isNonEmptyString(phone)) {
    errors.push("Phone number is required");
  } else if (!PHONE_REGEX.test(phone.trim())) {
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

  return errors;
};

const validateLogin = (body) => {
  const errors = [];
  const { email, password } = body;

  if (!isNonEmptyString(email)) {
    errors.push("Email is required");
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push("Please provide a valid email address");
  }

  if (!isNonEmptyString(password)) {
    errors.push("Password is required");
  }

  return errors;
};

module.exports = {
  USER_ROLES,
  validateRegister,
  validateLogin,
};
