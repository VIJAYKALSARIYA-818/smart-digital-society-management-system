const NOTICE_CATEGORIES = ["General", "Maintenance", "Emergency", "Event", "Meeting", "Holiday", "Security"];
const NOTICE_PRIORITIES = ["Low", "Medium", "High"];

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const isValidDateString = (value) => {
  if (!isNonEmptyString(value)) {
    return false;
  }

  return !Number.isNaN(Date.parse(value));
};

const isValidCreatedByValue = (value) => {
  if (value === undefined || value === null) {
    return false;
  }

  const stringValue = typeof value === "string" ? value : value.toString?.();

  return isNonEmptyString(stringValue) && /^[a-fA-F0-9]{24}$/.test(stringValue.trim());
};

const validateNoticePayload = (body, { partial = false } = {}) => {
  const errors = [];
  const {
    title,
    description,
    category,
    priority,
    publishDate,
    expiryDate,
    attachment,
    createdBy,
    isPublished,
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
    } else if (!NOTICE_CATEGORIES.includes(category)) {
      errors.push("Category is invalid");
    }
  }

  if (priority !== undefined && !NOTICE_PRIORITIES.includes(priority)) {
    errors.push("Priority is invalid");
  }

  if (!partial || publishDate !== undefined) {
    if (!isValidDateString(publishDate)) {
      errors.push("Publish date is required and must be valid");
    }
  }

  if (!partial || expiryDate !== undefined) {
    if (!isValidDateString(expiryDate)) {
      errors.push("Expiry date is required and must be valid");
    }
  }

  if (
    publishDate !== undefined &&
    expiryDate !== undefined &&
    isValidDateString(publishDate) &&
    isValidDateString(expiryDate) &&
    new Date(expiryDate) <= new Date(publishDate)
  ) {
    errors.push("Expiry date must be after publish date");
  }

  if (attachment !== undefined && attachment !== null && typeof attachment !== "string") {
    errors.push("Attachment must be a string");
  }

  if (!partial || createdBy !== undefined) {
    if (!isValidCreatedByValue(createdBy)) {
      errors.push("Created by is required");
    }
  }

  if (isPublished !== undefined && typeof isPublished !== "boolean") {
    errors.push("isPublished must be a boolean value");
  }

  return errors;
};

module.exports = {
  NOTICE_CATEGORIES,
  NOTICE_PRIORITIES,
  validateNoticePayload,
};