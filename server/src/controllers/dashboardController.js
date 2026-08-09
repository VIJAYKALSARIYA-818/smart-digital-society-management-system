const Resident = require("../models/Resident");
const Visitor = require("../models/Visitor");
const Complaint = require("../models/Complaint");
const MaintenanceBill = require("../models/MaintenanceBill");
const Parking = require("../models/Parking");
const Amenity = require("../models/Amenity");
const Booking = require("../models/Booking");
const Package = require("../models/Package");
const asyncHandler = require("../utils/asyncHandler");

const getDashboardSummary = asyncHandler(async (req, res) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [
    totalResidents,
    totalVisitors,
    openComplaints,
    pendingMaintenanceBills,
    activeParkingSlots,
    totalAmenities,
    upcomingBookings,
    expectedPackages,
    recentResidents,
    recentComplaints,
    recentVisitors,
    recentParking,
    recentBookings,
    recentPackages,
    complaintsByStatus,
    maintenanceBillsByStatus,
    parkingByStatus,
    packageDeliveryStatus,
    amenityBookingStatus,
  ] = await Promise.all([
    // Summary counts
    Resident.countDocuments({ isActive: true }),
    Visitor.countDocuments({ isActive: true }),
    Complaint.countDocuments({ status: { $in: ["Open", "In Progress"] }, isActive: true }),
    MaintenanceBill.countDocuments({ status: "Pending", isActive: true }),
    Parking.countDocuments({ status: "Active", isActive: true }),
    Amenity.countDocuments({ isActive: true }),
    Booking.countDocuments({
      status: { $in: ["Pending", "Confirmed"] },
      bookingDate: { $gte: today, $lte: thirtyDaysFromNow },
    }),
    Package.countDocuments({ status: "Expected", isActive: true }),

    // Recent activities (last 7 days)
    Resident.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("fullName flatNumber block residentType createdAt"),
    Complaint.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title category status flatNumber residentName createdAt"),
    Visitor.find({ isActive: true })
      .sort({ checkInTime: -1 })
      .limit(5)
      .select("fullName purpose flatNumber block status checkInTime createdAt"),
    Parking.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("slotNumber vehicleNumber residentName flatNumber status createdAt"),
    Booking.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("amenityName residentName bookingDate status createdAt"),
    Package.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("trackingNumber residentName courier status createdAt"),

    // Analytics data
    Complaint.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    MaintenanceBill.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Parking.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Package.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Booking.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  const formatActivity = (item, type) => {
    const common = {
      id: item._id,
      createdAt: item.createdAt,
    };

    switch (type) {
      case "resident":
        return {
          ...common,
          type: "New Resident",
          title: `${item.fullName} joined as ${item.residentType}`,
          subtitle: `Flat ${item.flatNumber}${item.block ? `, ${item.block}` : ""}`,
        };
      case "complaint":
        return {
          ...common,
          type: "Complaint",
          title: item.title,
          subtitle: `${item.category} - ${item.status}`,
          metadata: `Flat ${item.flatNumber}`,
        };
      case "visitor":
        return {
          ...common,
          type: "Visitor",
          title: `${item.fullName} - ${item.purpose}`,
          subtitle: `Flat ${item.flatNumber}${item.block ? `, ${item.block}` : ""}`,
          metadata: item.status,
        };
      case "parking":
        return {
          ...common,
          type: "Parking",
          title: `Slot ${item.slotNumber} allocated`,
          subtitle: `${item.vehicleNumber} - ${item.residentName}`,
          metadata: item.status,
        };
      case "booking":
        return {
          ...common,
          type: "Booking",
          title: `${item.amenityName} booking`,
          subtitle: `${item.residentName} - ${new Date(item.bookingDate).toLocaleDateString()}`,
          metadata: item.status,
        };
      case "package":
        return {
          ...common,
          type: "Package",
          title: `${item.trackingNumber} via ${item.courier}`,
          subtitle: `For ${item.residentName}`,
          metadata: item.status,
        };
      default:
        return common;
    }
  };

  const allActivities = [
    ...recentResidents.map((item) => formatActivity(item, "resident")),
    ...recentComplaints.map((item) => formatActivity(item, "complaint")),
    ...recentVisitors.map((item) => formatActivity(item, "visitor")),
    ...recentParking.map((item) => formatActivity(item, "parking")),
    ...recentBookings.map((item) => formatActivity(item, "booking")),
    ...recentPackages.map((item) => formatActivity(item, "package")),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
   .slice(0, 10);

  const formatAnalytics = (data) => {
    const result = {};
    data.forEach((item) => {
      result[item._id] = item.count;
    });
    return result;
  };

  res.status(200).json({
    success: true,
    message: "Dashboard summary fetched successfully",
    data: {
      summary: {
        totalResidents,
        totalVisitors,
        openComplaints,
        pendingMaintenanceBills,
        activeParkingSlots,
        totalAmenities,
        upcomingBookings,
        expectedPackages,
      },
      analytics: {
        complaintsByStatus: formatAnalytics(complaintsByStatus),
        maintenanceBillsByStatus: formatAnalytics(maintenanceBillsByStatus),
        parkingByStatus: formatAnalytics(parkingByStatus),
        packageDeliveryStatus: formatAnalytics(packageDeliveryStatus),
        amenityBookingStatus: formatAnalytics(amenityBookingStatus),
      },
      recentActivities: allActivities,
    },
  });
});

module.exports = {
  getDashboardSummary,
};