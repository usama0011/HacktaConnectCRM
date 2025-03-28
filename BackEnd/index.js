// Import required modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import userTrackingRoute from "./routes/userTracking.js"; // Adjust path if needed

// Import all route files
import authRoutes from "./routes/authRoutes.js";
import ipRoutes from "./routes/ipRoutes.js";
import salaryRoutes from "./routes/salaryRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js"; // Ensure this file is created for attendance management

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://usama226390:usama226390@cluster0.dy53h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Basic Route
app.get("/", (req, res) => {
  res.send("Welcome to Hackta Connect CRM Backend!");
});

// **Register API Routes**
app.use("/api/auth", authRoutes); // Authentication (Signup, Login, Logout)
app.use("/api/tracking", userTrackingRoute); // Your /api/track-user route
app.use("/api/ip", ipRoutes); // IP Submission (Clicks & Sessions)
app.use("/api/salary", salaryRoutes); // Salary Management (Draft, Edit, Finalize)
app.use("/api/reports", reportRoutes); // User Reports (By Year, Month, Day)
app.use("/api/attendance", attendanceRoutes); // Attendance Tracking (Check-in, Check-out)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
