const mongoose = require("mongoose");

const paymentHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["Pending", "Paid", "Overdue"],
      required: true,
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Bank Transfer", "Card", ""],
      default: "",
    },
    transactionId: {
      type: String,
      default: "",
    },
    remarks: {
      type: String,
      default: "",
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const maintenanceBillSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: [true, "Resident is required"],
    },
    residentName: {
      type: String,
      required: [true, "Resident name is required"],
      trim: true,
      minlength: [2, "Resident name must be at least 2 characters"],
    },
    flatNumber: {
      type: String,
      required: [true, "Flat number is required"],
      trim: true,
    },
    billMonth: {
      type: Number,
      required: [true, "Bill month is required"],
      min: [1, "Bill month is invalid"],
      max: [12, "Bill month is invalid"],
    },
    billYear: {
      type: Number,
      required: [true, "Bill year is required"],
      min: [2000, "Bill year is invalid"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Overdue"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Bank Transfer", "Card", ""],
      default: "",
    },
    transactionId: {
      type: String,
      default: "",
      trim: true,
    },
    remarks: {
      type: String,
      default: "",
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Created by is required"],
    },
    paymentHistory: {
      type: [paymentHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const MaintenanceBill = mongoose.model("MaintenanceBill", maintenanceBillSchema);

module.exports = MaintenanceBill;