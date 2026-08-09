const mongoose = require("mongoose");

const societySettingsSchema = new mongoose.Schema(
  {
    societyName: {
      type: String,
      required: [true, "Society name is required"],
      trim: true,
      default: "Smart Digital Society",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"],
      default: "",
    },
    contactPhone: {
      type: String,
      trim: true,
      default: "",
    },
    maintenanceDueDay: {
      type: Number,
      min: 1,
      max: 28,
      default: 1,
    },
    noticeBoardEnabled: {
      type: Boolean,
      default: true,
    },
    visitorPreApproval: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// There should only be one settings document
societySettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const SocietySettings = mongoose.model("SocietySettings", societySettingsSchema);

module.exports = SocietySettings;