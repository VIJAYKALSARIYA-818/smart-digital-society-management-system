const mongoose = require("mongoose");

const amenitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Amenity name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    type: {
      type: String,
      enum: ["Sports", "Recreation", "Community", "Service", "Other"],
      default: "Other",
    },
    capacity: {
      type: Number,
      default: 1,
      min: [1, "Capacity must be at least 1"],
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    facilities: {
      type: [String],
      default: [],
    },
    operatingHours: {
      type: String,
      trim: true,
      default: "",
    },
    bookingFee: {
      type: Number,
      default: 0,
      min: [0, "Booking fee cannot be negative"],
    },
    requiresApproval: {
      type: Boolean,
      default: false,
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

const Amenity = mongoose.model("Amenity", amenitySchema);

module.exports = Amenity;