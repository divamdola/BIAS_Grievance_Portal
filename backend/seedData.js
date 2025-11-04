import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/user.js";

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");

    // Clear existing admin users (optional - comment out if you don't want to clear)
    await User.deleteMany({ role: { $in: ["director", "hod", "registrar", "warden"] } });

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create admin users
    const adminUsers = [
      {
        name: "Director",
        email: "director@college.edu",
        password: hashedPassword,
        role: "director",
        department: "Administration",
      },
      {
        name: "HOD Computer Science",
        email: "hod.cs@college.edu",
        password: hashedPassword,
        role: "hod",
        department: "Computer Science",
      },
      {
        name: "HOD Mechanical",
        email: "hod.mech@college.edu",
        password: hashedPassword,
        role: "hod",
        department: "Mechanical",
      },
      {
        name: "Registrar",
        email: "registrar@college.edu",
        password: hashedPassword,
        role: "registrar",
        department: "Administration",
      },
      {
        name: "Hostel Warden",
        email: "warden@college.edu",
        password: hashedPassword,
        role: "warden",
        department: "Hostel",
      },
    ];

    await User.insertMany(adminUsers);

    console.log("✅ Seed data inserted successfully!");
    console.log("\n📋 Admin Users Created:");
    console.log("=".repeat(50));
    adminUsers.forEach((user) => {
      console.log(`Role: ${user.role.toUpperCase()}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: admin123`);
      console.log("-".repeat(50));
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
