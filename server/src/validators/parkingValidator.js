const validateParking = (data) => {
  const errors = {};

  if (!data.slotNumber || !data.slotNumber.trim()) {
    errors.slotNumber = "Slot number is required";
  }

  const validVehicleTypes = [
    "Two Wheeler",
    "Four Wheeler",
    "Truck",
    "Motorcycle",
    "Scooter",
  ];

  if (!data.vehicleType || !validVehicleTypes.includes(data.vehicleType)) {
    errors.vehicleType = "Valid vehicle type is required";
  }

  if (!data.vehicleNumber || !data.vehicleNumber.trim()) {
    errors.vehicleNumber = "Vehicle number is required";
  }

  if (!data.residentId) {
    errors.residentId = "Resident is required";
  }

  if (!data.expiryDate) {
    errors.expiryDate = "Expiry date is required";
  }

  const validStatuses = [
    "Active",
    "Inactive",
    "Expired",
    "Occupied",
    "Vacant",
  ];

  if (data.status && !validStatuses.includes(data.status)) {
    errors.status = "Invalid parking status";
  }

  const validSlotTypes = [
    "Covered",
    "Open",
    "Reserved",
  ];

  if (data.parkingSlotType && !validSlotTypes.includes(data.parkingSlotType)) {
    errors.parkingSlotType = "Invalid parking slot type";
  }

  if (!data.contactNumber || !data.contactNumber.trim()) {
    errors.contactNumber = "Contact number is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateParking,
};