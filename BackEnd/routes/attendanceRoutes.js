import express from "express";
import {
  markAttendance,
  getAttendanceByUser,
} from "../controllers/attendanceController.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// **Mark Attendance (Check-in & Check-out)**
router.post("/mark", authMiddleware, markAttendance);

// **Get Attendance for a User**
router.get("/:userId", authMiddleware, getAttendanceByUser);

export default router;
