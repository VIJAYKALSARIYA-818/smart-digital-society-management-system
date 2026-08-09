const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const validateSettingsUpdate = (body) => {
  const errors = [];
  const {
    societyName,
    address,
    contactEmail,
    contactPhone,
    maintenanceDueDay,
  } = body;

  if (societyName !== undefined) {
    if (!isNonEmptyString(societyName)) {
      errors.push("Society name is required");
    } else if (societyName.trim().length < 2) {
      errors.push("Society name must be at least 2 characters");
    }
  }

  if (contactEmail !== undefined && contactEmail !== "") {
    if (!isNonEmptyString(contactEmail)) {
      errors.push("Contact email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
      errors.push("Please provide a valid email address");
    }
  }

  if (contactPhone !== undefined && contactPhone !== "") {
    if (!isNonEmptyString(contactPhone)) {
      errors.push("Contact phone is required");
    } else if (!/^[+]?[\d\s-]{10,15}$/.test(contactPhone.trim())) {
      errors.push("Please provide a valid phone number");
    }
  }

  if (maintenanceDueDay !== undefined) {
    if (typeof maintenanceDueDay !== "number") {
      errors.push("Maintenance due day must be a number");
    } else if (maintenanceDueDay < 1 || maintenanceDueDay > 28) {
      errors.push("Maintenance due day must be between 1 and 28");
    }
  }

  return errors;
};

module.exports = {
  validateSettingsUpdate,
};