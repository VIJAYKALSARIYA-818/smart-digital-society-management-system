const SocietySettings = require("../models/SocietySettings");
const asyncHandler = require("../utils/asyncHandler");

const formatSettingsResponse = (settings) => ({
  id: settings._id,
  societyName: settings.societyName,
  address: settings.address,
  contactEmail: settings.contactEmail,
  contactPhone: settings.contactPhone,
  maintenanceDueDay: settings.maintenanceDueDay,
  noticeBoardEnabled: settings.noticeBoardEnabled,
  visitorPreApproval: settings.visitorPreApproval,
  createdAt: settings.createdAt,
  updatedAt: settings.updatedAt,
});

const getSettings = asyncHandler(async (req, res) => {
  const settings = await SocietySettings.getSettings();

  res.status(200).json({
    success: true,
    message: "Settings fetched successfully",
    data: {
      settings: formatSettingsResponse(settings),
    },
  });
});

const updateSettings = asyncHandler(async (req, res) => {
  const settings = await SocietySettings.getSettings();

  const allowedFields = [
    "societyName",
    "address",
    "contactEmail",
    "contactPhone",
    "maintenanceDueDay",
    "noticeBoardEnabled",
    "visitorPreApproval",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      if (typeof req.body[field] === "string") {
        settings[field] = req.body[field].trim();
      } else {
        settings[field] = req.body[field];
      }
    }
  });

  const updatedSettings = await settings.save();

  res.status(200).json({
    success: true,
    message: "Settings updated successfully",
    data: {
      settings: formatSettingsResponse(updatedSettings),
    },
  });
});

module.exports = {
  getSettings,
  updateSettings,
};