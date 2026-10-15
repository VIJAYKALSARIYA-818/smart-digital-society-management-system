/**
 * Dev helper: boots an in-memory MongoDB, seeds demo users, then starts the API.
 * Use when local MongoDB is not installed.
 */
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

(async () => {
  console.log("Starting in-memory MongoDB...");
  const mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri("smart_society");
  console.log("In-memory MongoDB ready");

  mongoose.connection.once("connected", async () => {
    try {
      const { seedUsers, DEMO_PASSWORD } = require("./seedUsers");
      const results = await seedUsers();
      console.log(`\nDemo users ready (password for all: ${DEMO_PASSWORD})\n`);
      results.forEach((item) => {
        console.log(`  [${item.status}] ${item.role.padEnd(20)} ${item.email}`);
      });
      console.log("");
    } catch (error) {
      console.error("Seed failed:", error.message);
    }
  });

  require("../src/server");

  const shutdown = async () => {
    await mongod.stop();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
})().catch((error) => {
  console.error("Failed to start memory MongoDB:", error.message);
  process.exit(1);
});
