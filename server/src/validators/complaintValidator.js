const COMPLAINT_CATEGORIES = [
  "Water",
  "Electricity",
  "Lift",
  "Security",
  "Parking",
  "Cleaning",
  "Maintenance",
  "Other",
];

const COMPLAINT_PRIORITIES = ["Low", "Medium", "High", "Critical"];
const COMPLAINT_STATUSES = ["Open", "In Progress", "Resolved", "Closed"];

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const validateComplaintPayload = (body, { partial = false } = {}) => {
  const errors = [];
  const {
    title,
    description,
    category,
    priority,
    status,
    residentName,
    flatNumber,
    assignedTo,
    resolution,
    isActive,
  } = body;

  if (!partial || title !== undefined) {
    if (!isNonEmptyString(title)) {
      errors.push("Title is required");
    } else if (title.trim().length < 3) {
      errors.push("Title must be at least 3 characters");
    }
  }

  if (!partial || description !== undefined) {
    if (!isNonEmptyString(description)) {
      errors.push("Description is required");
    } else if (description.trim().length < 10) {
      errors.push("Description must be at least 10 characters");
    }
  }

  if (!partial || category !== undefined) {
    if (!isNonEmptyString(category)) {
      errors.push("Category is required");
    } else if (!COMPLAINT_CATEGORIES.includes(category)) {
      errors.push("Category is invalid");
    }
  }

  if (priority !== undefined && !COMPLAINT_PRIORITIES.includes(priority)) {
    errors.push("Priority is invalid");
  }

  if (status !== undefined && !COMPLAINT_STATUSES.includes(status)) {
    errors.push("Status is invalid");
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

  if (assignedTo !== undefined && assignedTo !== null && typeof assignedTo !== "string") {
    errors.push("Assigned to must be a string");
  }

  if (resolution !== undefined && resolution !== null && typeof resolution !== "string") {
    errors.push("Resolution must be a string");
  }

  if (isActive !== undefined && typeof isActive !== "boolean") {
    errors.push("isActive must be a boolean value");
  }

  return errors;
};

module.exports = {
  COMPLAINT_CATEGORIES,
  COMPLAINT_PRIORITIES,
  COMPLAINT_STATUSES,
  validateComplaintPayload,
};