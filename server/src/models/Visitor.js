const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },
    purpose: {
      type: String,
      required: [true, "Purpose is required"],
      trim: true,
    },
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
    checkInTime: {
      type: Date,
      default: Date.now,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Inside", "Exited"],
      default: "Inside",
    },
    vehicleNumber: {
      type: String,
      trim: true,
      default: "",
    },
    idProofType: {
      type: String,
      trim: true,
      default: "",
    },
    idProofNumber: {
      type: String,
      trim: true,
      default: "",
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
  },
);

const Visitor = mongoose.model("Visitor", visitorSchema);

module.exports = Visitor;