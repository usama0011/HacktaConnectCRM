import express from "express";
import {
  getTodayAttendance,
  markAttendance,
  markCheckoutTime,
  updateAttendanceStatus,
} from "../controllers/attendanceController.js";

const router = express.Router();

// **Mark Attendance (Check-in & Check-out)**
router.post("/mark", markAttendance);
router.put("/updatestatus", updateAttendanceStatus);
router.get("/today/:userId", getTodayAttendance);
router.put("/checkout", markCheckoutTime);

export default router;
