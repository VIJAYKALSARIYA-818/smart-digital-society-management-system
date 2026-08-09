const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    amenityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Amenity",
      required: [true, "Amenity is required"],
    },
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: [true, "Resident is required"],
    },
    bookingDate: {
      type: Date,
      required: [true, "Booking date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
    },
    purpose: {
      type: String,
      trim: true,
      default: "",
    },
    attendees: {
      type: Number,
      default: 1,
      min: [1, "Attendees must be at least 1"],
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed", "Rejected"],
      default: "Pending",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    // Denormalized fields for performance
    amenityName: {
      type: String,
      required: [true, "Amenity name is required"],
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
  },
  {
    timestamps: true,
  }
);

// Index for preventing conflicting bookings
bookingSchema.index({ amenityId: 1, bookingDate: 1, startTime: 1, endTime: 1, status: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;