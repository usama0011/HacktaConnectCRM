import express from "express";
import {
  getTodayAttendance,
  getAllUsersAttendance,
  markAttendanceForAgent,
  agentCheckout,
  updateAttendanceStatus,
  getSingleUserAttendance,
  adminCreateAttendance
} from "../controllers/attendanceController.js";
import { adminSideAuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// **Mark Attendance (Check-in & Check-out)**
router.get("/today/:userId", getTodayAttendance);
router.post("/admin-create", adminCreateAttendance);
router.get("/all", adminSideAuthMiddleware, getAllUsersAttendance);
router.post("/mark", markAttendanceForAgent); // ✅ New route for marking attendance
router.put("/checkout", agentCheckout); // ✅ New route for agent checkout
router.put("/update-status", updateAttendanceStatus); // ✅ New Route
router.get("/user/:userId",adminSideAuthMiddleware, getSingleUserAttendance);

export default router;
