import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

// Load environment variables
dotenv.config();

// App config
const app = express();
const port = process.env.PORT || 9000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("College Grievance Management System API");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});