const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },
    category: {
      type: String,
      enum: ["Water", "Electricity", "Lift", "Security", "Parking", "Cleaning", "Maintenance", "Other"],
      required: [true, "Category is required"],
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    residentName: {
      type: String,
      required: [true, "Resident name is required"],
      trim: true,
    },
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      default: null,
    },
    flatNumber: {
      type: String,
      required: [true, "Flat number is required"],
      trim: true,
    },
    assignedTo: {
      type: String,
      trim: true,
      default: "",
    },
    resolution: {
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

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;