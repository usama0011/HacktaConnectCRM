import express from "express";
import {
  markAttendance,
  getAttendanceByUser,
  updateAttendanceStatus,
} from "../controllers/attendanceController.js";

const router = express.Router();

// **Mark Attendance (Check-in & Check-out)**
router.post("/mark", markAttendance);
router.put("/updatestatus", updateAttendanceStatus);

// **Get Attendance for a User**
router.get("/:userId", getAttendanceByUser);

export default router;
