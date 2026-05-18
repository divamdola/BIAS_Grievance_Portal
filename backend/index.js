import "dotenv/config";
// Load environment variables FIRST before any other imports

import express from "express";
import cors from "cors";
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
  "http://localhost:5173"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);

    // Strip trailing slashes from incoming origin if any exist
    const sanitizedOrigin = origin.replace(/\/$/, "");

    if (allowedOrigins.includes(sanitizedOrigin)) {
      return callback(null, true);
    } else {
      console.log(`[CORS Blocked] Origin: ${origin} not found in allowed list.`);
      return callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200, // Changed from 204 to 200 for broader browser compatibility
};

app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));
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