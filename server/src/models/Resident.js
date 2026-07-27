const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    flatNumber: {
      type: String,
      required: [true, "Flat number is required"],
      unique: true,
      trim: true,
    },
    block: {
      type: String,
      trim: true,
      default: "",
    },
    residentType: {
      type: String,
      enum: ["Owner", "Tenant", "Family Member", "Other"],
      default: "Owner",
    },
    moveInDate: {
      type: Date,
      default: null,
    },
    profileImage: {
      type: String,
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

const Resident = mongoose.model("Resident", residentSchema);

module.exports = Resident;