import "dotenv/config";
// Load environment variables FIRST before any other imports

import express from "express";
const cors = require("cors");
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

// App config
const app = express();
const port = process.env.PORT || 9000;

// Middleware
const allowedOrigins = [
  "http://89.233.104.66:4173",
  "https://bias-grievance-portal-1.onrender.com",
  "http://localhost:5173"  // For local development
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));
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