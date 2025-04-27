// Import required modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import userTrackingRoute from "./routes/userTracking.js"; // Adjust path if needed
import chatRoutes from "./routes/chatRoutes.js";
import qcpointsRoute from "./routes/qcPointRoutes.js";
import wfhSalaryFormulaRoutes from "./routes/wfhSalaryFormulaRoutes.js";
import uploadRoutes from "./routes/uploadroute.js";
import salaryCalculatorOfficeAgents from "./routes/salaryFormulaOfficeagentsroute.js";
import mangoProxyRoutes from "./routes/mangoproxy.js";
import DownloadSalaryReport from "./routes/downloadsalaryroute.js";
// Import all route files
import taskRoutes from "./routes/taskRoutes.js";

import authRoutes from "./routes/authRoutes.js";
import SmartProxyRoute from "./routes/smartproxy.js";
import ipRoutes from "./routes/ipRoutes.js";
import salaryRoutes from "./routes/salaryRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js"; // Ensure this file is created for attendance management
import { calculateGeneralSalary } from "./routes/salarySessionsClicks.js";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: [
    "https://hackta-connect-crm-client.vercel.app",
    "http://localhost:5173",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://za5232208:za5232208@hacktanewcrmdb.cyoxrvc.mongodb.net/?retryWrites=true&w=majority&appName=HacktaNewCRMDB"
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
app.use("/api/qcpoints", qcpointsRoute); // Your /api/track-user route
app.use("/api/upload", uploadRoutes);
app.use("/api/ip", ipRoutes); // IP Submission (Clicks & Sessions)
app.use("/api/tasks", taskRoutes);
app.use("/api/salaryformulaofficeagents", salaryCalculatorOfficeAgents);
app.use("/api/wfhformula", wfhSalaryFormulaRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/smartproxy", SmartProxyRoute);
app.use("/api/mangoproxy", mangoProxyRoutes);
app.use("/api/salarycalculator", calculateGeneralSalary);
app.use("/api/downloadslarayreport", DownloadSalaryReport);

app.use("/api/salary", salaryRoutes); // Salary Management (Draft, Edit, Finalize)
app.use("/api/reports", reportRoutes); // User Reports (By Year, Month, Day)
app.use("/api/attendance", attendanceRoutes); // Attendance Tracking (Check-in, Check-out)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
