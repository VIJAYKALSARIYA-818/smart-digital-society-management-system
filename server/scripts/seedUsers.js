/**
 * Seeds demo users for each role.
 * Usage: node scripts/seedUsers.js
 */
require("dotenv").config({ quiet: true });

const { connectDB, disconnectDB } = require("../src/config/db");
const User = require("../src/models/User");

const DEMO_PASSWORD = "Password123";

const DEMO_USERS = [
  {
    fullName: "Society Admin",
    email: "admin@society.com",
    phone: "9876543210",
    flatNumber: "A-101",
    role: "Society Admin",
    password: DEMO_PASSWORD,
  },
  {
    fullName: "Ravi Resident",
    email: "resident@society.com",
    phone: "9876543211",
    flatNumber: "B-204",
    role: "Resident",
    password: DEMO_PASSWORD,
  },
  {
    fullName: "Suresh Guard",
    email: "guard@society.com",
    phone: "9876543212",
    flatNumber: "Gate-1",
    role: "Security Guard",
    password: DEMO_PASSWORD,
  },
  {
    fullName: "Meena Maintenance",
    email: "staff@society.com",
    phone: "9876543213",
    flatNumber: "Office-1",
    role: "Maintenance Staff",
    password: DEMO_PASSWORD,
  },
];

const seedUsers = async ({ disconnect = true } = {}) => {
  const results = [];

  for (const demoUser of DEMO_USERS) {
    const email = demoUser.email.toLowerCase();
    const existing = await User.findOne({ email });

    if (existing) {
      existing.fullName = demoUser.fullName;
      existing.phone = demoUser.phone;
      existing.flatNumber = demoUser.flatNumber;
      existing.role = demoUser.role;
      existing.isActive = true;
      existing.password = demoUser.password;
      await existing.save();
      results.push({ email, status: "updated", role: demoUser.role });
      continue;
    }

    await User.create(demoUser);
    results.push({ email, status: "created", role: demoUser.role });
  }

  return results;
};

const run = async () => {
  try {
    await connectDB();
    const results = await seedUsers();

    console.log("\nDemo users ready (password for all: Password123)\n");
    results.forEach((item) => {
      console.log(`  [${item.status}] ${item.role.padEnd(20)} ${item.email}`);
    });
    console.log("");
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
};

if (require.main === module) {
  run();
}

module.exports = { seedUsers, DEMO_USERS, DEMO_PASSWORD };
