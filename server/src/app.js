console.log("APP FILE LOADED");
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Digital Society Management System API is running",
  });
});

console.log("Loading auth routes...");
console.log(authRoutes);

// Debug middleware
app.use("/api/auth", (req, res, next) => {
  console.log("AUTH REQUEST:", req.method, req.originalUrl);
  next();
});

// Mount auth routes ONLY ONCE
app.use("/api/auth", authRoutes);

console.log("=== Registered Auth Routes ===");

authRoutes.stack.forEach((layer) => {
  if (layer.route) {
    console.log(
      Object.keys(layer.route.methods).join(",").toUpperCase(),
      layer.route.path
    );
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;