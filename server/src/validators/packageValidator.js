const PACKAGE_TYPES = ["Parcel", "Envelope", "Document", "Fragile", "Food", "Electronics", "Other"];
const PACKAGE_STATUSES = ["Expected", "Received", "Delivered", "Picked Up", "Returned", "Cancelled"];

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const isValidDateString = (value) => {
  if (!isNonEmptyString(value)) {
    return false;
  }
  return !Number.isNaN(Date.parse(value));
};

const validatePackagePayload = (body, { partial = false } = {}) => {
  const errors = [];
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
  } = body;

  if (!partial || trackingNumber !== undefined) {
    if (!isNonEmptyString(trackingNumber)) {
      errors.push("Tracking number is required");
    }
  }

  if (!partial || residentId !== undefined) {
    if (!residentId) {
      errors.push("Resident is required");
    }
  }

  if (!partial || courier !== undefined) {
    if (!isNonEmptyString(courier)) {
      errors.push("Courier/company name is required");
    }
  }

  if (!partial || senderName !== undefined) {
    if (!isNonEmptyString(senderName)) {
      errors.push("Sender name is required");
    }
  }

  if (senderContact !== undefined && senderContact !== null && typeof senderContact !== "string") {
    errors.push("Sender contact must be a string");
  }

  if (packageType !== undefined && !PACKAGE_TYPES.includes(packageType)) {
    errors.push("Invalid package type");
  }

  if (description !== undefined && description !== null && typeof description !== "string") {
    errors.push("Description must be a string");
  }

  if (!partial || expectedDeliveryDate !== undefined) {
    if (!isValidDateString(expectedDeliveryDate)) {
      errors.push("Valid expected delivery date is required");
    }
  }

  if (actualDeliveryDate !== undefined && actualDeliveryDate !== null && !isValidDateString(actualDeliveryDate)) {
    errors.push("Actual delivery date must be a valid date");
  }

  if (receivedDate !== undefined && receivedDate !== null && !isValidDateString(receivedDate)) {
    errors.push("Received date must be a valid date");
  }

  if (status !== undefined && !PACKAGE_STATUSES.includes(status)) {
    errors.push("Invalid package status");
  }

  if (deliveryPersonName !== undefined && deliveryPersonName !== null && typeof deliveryPersonName !== "string") {
    errors.push("Delivery person name must be a string");
  }

  if (deliveryPersonContact !== undefined && deliveryPersonContact !== null && typeof deliveryPersonContact !== "string") {
    errors.push("Delivery person contact must be a string");
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
  PACKAGE_TYPES,
  PACKAGE_STATUSES,
  validatePackagePayload,
};