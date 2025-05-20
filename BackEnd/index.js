// Import required modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userTrackingRoute from "./routes/userTracking.js"; // Adjust path if needed
import chatRoutes from "./routes/chatRoutes.js";
import qcpointsRoute from "./routes/qcPointRoutes.js";
import wfhSalaryFormulaRoutes from "./routes/wfhSalaryFormulaRoutes.js";
import uploadRoutes from "./routes/uploadroute.js";
import salaryCalculatorOfficeAgents from "./routes/salaryFormulaOfficeagentsroute.js";
import mangoProxyRoutes from "./routes/mangoproxy.js";
import mangoProxyRoutesb from "./routes/mangoproxyb.js";
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
const app = express();
dotenv.config();

try {
  await mongoose.connect(
    "mongodb+srv://za5232208:za5232208@hacktanewcrmdb.cyoxrvc.mongodb.net/?retryWrites=true&w=majority&appName=HacktaNewCRMDB"
  );
  console.log("Database Connection Successfully!!");
} catch (error) {
  console.error("Error connecting to MongoDB:", error.message);
  process.exit(1); // Exit the process if unable to connect to MongoDB
}

app.use(cors());
app.use(express.json());

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
app.use("/api/mangoproxyb", mangoProxyRoutesb);
app.use("/api/salarycalculator", calculateGeneralSalary);
app.use("/api/downloadslarayreport", DownloadSalaryReport);

app.use("/api/salary", salaryRoutes); // Salary Management (Draft, Edit, Finalize)
app.use("/api/reports", reportRoutes); // User Reports (By Year, Month, Day)
app.use("/api/attendance", attendanceRoutes); // Attendance Tracking (Check-in,

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
});
// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
