const express = require("express");
const cors = require("cors");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");
const residentRoutes = require("./routes/residentRoutes");
const parkingRoutes = require("./routes/parkingRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const amenityRoutes = require("./routes/amenityRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const packageRoutes = require("./routes/packageRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

// Load passport only if Google OAuth is configured
let passport;
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport = require("./config/passport");
}

const app = express();

// Session configuration for OAuth
app.use(session({
  secret: process.env.SESSION_SECRET || 'smart_society_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport only if Google OAuth is configured
if (passport) {
  app.use(passport.initialize());
  app.use(passport.session());
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Digital Society Management System API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/residents", residentRoutes);
app.use("/api/parking", parkingRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/maintenance-bills", maintenanceRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/amenities", amenityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/settings", settingsRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;
