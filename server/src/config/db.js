const mongoose = require("mongoose");

/**
 * Registers Mongoose connection lifecycle listeners once.
 */
const registerConnectionEvents = () => {
  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to MongoDB");
  });

  mongoose.connection.on("error", (error) => {
    console.error("Mongoose connection error:", error.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from MongoDB");
  });
};

/**
 * Connects to MongoDB using the MONGODB_URI environment variable.
 * @returns {Promise<typeof mongoose>} Mongoose instance after successful connection
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  registerConnectionEvents();

  try {
    const connection = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    throw error;
  }
};

/**
 * Closes the MongoDB connection gracefully.
 * @returns {Promise<void>}
 */
const disconnectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.connection.close();
  console.log("MongoDB connection closed");
};

module.exports = { connectDB, disconnectDB };
