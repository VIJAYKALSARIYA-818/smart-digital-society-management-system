const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    trackingNumber: {
      type: String,
      required: [true, "Tracking number is required"],
      trim: true,
      unique: true,
    },
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: [true, "Resident is required"],
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
      trim: true,
      default: "",
    },
    courier: {
      type: String,
      required: [true, "Courier/company name is required"],
      trim: true,
    },
    senderName: {
      type: String,
      required: [true, "Sender name is required"],
      trim: true,
    },
    senderContact: {
      type: String,
      trim: true,
      default: "",
    },
    packageType: {
      type: String,
      enum: ["Parcel", "Envelope", "Document", "Fragile", "Food", "Electronics", "Other"],
      default: "Other",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    expectedDeliveryDate: {
      type: Date,
      required: [true, "Expected delivery date is required"],
    },
    actualDeliveryDate: {
      type: Date,
      default: null,
    },
    receivedDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Expected", "Received", "Delivered", "Picked Up", "Returned", "Cancelled"],
      default: "Expected",
    },
    deliveryPersonName: {
      type: String,
      trim: true,
      default: "",
    },
    deliveryPersonContact: {
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
  }
);

// Index for efficient searching (excluding trackingNumber since it's already unique)
packageSchema.index({ residentId: 1 });
packageSchema.index({ status: 1 });
packageSchema.index({ courier: 1 });

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;