import express from "express";
import {
  markAttendance,
  getAttendanceByUser,
} from "../controllers/attendanceController.js";

const router = express.Router();

// **Mark Attendance (Check-in & Check-out)**
router.post("/mark", markAttendance);

// **Get Attendance for a User**
router.get("/:userId", getAttendanceByUser);

export default router;
