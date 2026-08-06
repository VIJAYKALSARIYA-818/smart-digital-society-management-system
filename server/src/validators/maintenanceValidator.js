const BILL_STATUSES = ["Pending", "Paid", "Overdue"];
const PAYMENT_METHODS = ["Cash", "UPI", "Bank Transfer", "Card"];

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

const isValidObjectIdValue = (value) => {
  if (value === undefined || value === null) {
    return false;
  }

  const stringValue = typeof value === "string" ? value : value.toString?.();

  return isNonEmptyString(stringValue) && /^[a-fA-F0-9]{24}$/.test(stringValue.trim());
};

const isValidDateValue = (value) => {
  if (value instanceof Date) {
    return !Number.isNaN(value.getTime());
  }

  if (!isNonEmptyString(value)) {
    return false;
  }

  return !Number.isNaN(Date.parse(value));
};

const isValidMonth = (value) => Number.isInteger(value) && value >= 1 && value <= 12;

const isValidYear = (value) => Number.isInteger(value) && value >= 2000;

const isValidAmount = (value) => typeof value === "number" && Number.isFinite(value) && value > 0;

const validateMaintenanceBillPayload = (body, { partial = false } = {}) => {
  const errors = [];
  const {
    resident,
    residentName,
    flatNumber,
    billMonth,
    billYear,
    amount,
    dueDate,
    paymentDate,
    status,
    paymentMethod,
    transactionId,
    remarks,
    createdBy,
  } = body;

  if (!partial || resident !== undefined) {
    if (!isValidObjectIdValue(resident)) {
      errors.push("Resident is required");
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

  if (!partial || billMonth !== undefined) {
    if (!isValidMonth(Number.isNaN(Number(billMonth)) ? NaN : Number(billMonth))) {
      errors.push("Bill month is required and must be between 1 and 12");
    }
  }

  if (!partial || billYear !== undefined) {
    if (!isValidYear(Number.isNaN(Number(billYear)) ? NaN : Number(billYear))) {
      errors.push("Bill year is required and must be valid");
    }
  }

  if (!partial || amount !== undefined) {
    if (!isValidAmount(Number(amount))) {
      errors.push("Amount is required and must be greater than 0");
    }
  }

  if (!partial || dueDate !== undefined) {
    if (!isValidDateValue(dueDate)) {
      errors.push("Due date is required and must be valid");
    }
  }

  if (paymentDate !== undefined && paymentDate !== null && paymentDate !== "" && !isValidDateValue(paymentDate)) {
    errors.push("Payment date must be valid");
  }

  if (status !== undefined && !BILL_STATUSES.includes(status)) {
    errors.push("Status is invalid");
  }

  if (paymentMethod !== undefined && paymentMethod !== "" && !PAYMENT_METHODS.includes(paymentMethod)) {
    errors.push("Payment method is invalid");
  }

  if (transactionId !== undefined && transactionId !== null && typeof transactionId !== "string") {
    errors.push("Transaction ID must be a string");
  }

  if (remarks !== undefined && remarks !== null && typeof remarks !== "string") {
    errors.push("Remarks must be a string");
  }

  if (!partial || createdBy !== undefined) {
    if (!isValidObjectIdValue(createdBy)) {
      errors.push("Created by is required");
    }
  }

  if (status === "Paid" && paymentDate !== undefined && paymentDate !== null && !isValidDateValue(paymentDate)) {
    errors.push("Payment date is required when status is Paid");
  }

  return errors;
};

module.exports = {
  BILL_STATUSES,
  PAYMENT_METHODS,
  validateMaintenanceBillPayload,
};