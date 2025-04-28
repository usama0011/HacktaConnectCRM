import express from "express";
import {
  markAttendance,
  getAttendanceByUser,
  updateAttendanceStatus,
  getAllAgentsAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

// **Mark Attendance (Check-in & Check-out)**
router.post("/mark", markAttendance);
router.put("/updatestatus", updateAttendanceStatus);

// **Get Attendance for a User**
router.get("/:userId", getAttendanceByUser);
router.get("/all-agents", getAllAgentsAttendance);

export default router;
