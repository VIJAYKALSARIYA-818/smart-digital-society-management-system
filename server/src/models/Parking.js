const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema(
  {
    slotNumber: {
      type: String,
      required: [true, "Slot number is required"],
      trim: true,
      unique: true,
    },

    vehicleType: {
      type: String,
      required: [true, "Vehicle type is required"],
      trim: true,
      enum: [
        "Two Wheeler",
        "Four Wheeler",
        "Truck",
        "Motorcycle",
        "Scooter",
      ],
    },

    vehicleNumber: {
      type: String,
      required: [true, "Vehicle number is required"],
      trim: true,
      uppercase: true,
    },

    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: [true, "Resident is required"],
    },

    // Denormalized fields for performance and convenience
    residentName: {
      type: String,
      required: [true, "Resident name is required"],
      trim: true,
    },

    flatNumber: {
      type: String,
      required: [true, "Flat number is required"],
      trim: true,
    },

    block: {
      type: String,
      required: [true, "Block is required"],
      trim: true,
    },

    allocatedDate: {
      type: Date,
      default: Date.now,
    },

    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Expired", "Occupied", "Vacant"],
      default: "Active",
    },

    parkingSlotType: {
      type: String,
      enum: ["Covered", "Open", "Reserved"],
      default: "Covered",
    },

    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Parking = mongoose.model("Parking", parkingSchema);

module.exports = Parking;