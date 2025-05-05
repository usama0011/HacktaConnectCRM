import Attendance from "../models/attendanceModel.js";
import moment from "moment"; // install moment if not already installed
import User from "../models/usermodel.js";
import mongoose from "mongoose";
// **Mark User Attendance**
// controllers/attendanceController.js
export const markAttendance = async (req, res) => {
  const { userId, username } = req.body;

  try {
    const now = new Date();

    // Create date range for today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Check if attendance already exists for today (any time)
    let attendance = await Attendance.findOne({
      userId,
      date: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    });

    if (!attendance) {
      // ✅ Create only if it doesn't exist
      attendance = new Attendance({
        userId,
        username,
        date: now, // store current datetime
        checkInTime: now,
      });

      await attendance.save();

      return res.status(201).json({
        message: "Attendance marked for today",
        attendance,
      });
    } else {
      // ⚠️ Already submitted today
      return res.status(200).json({
        message: "Attendance already marked for today",
        attendance,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error marking attendance",
      error: error.message,
    });
  }
};

export const updateAttendanceStatus = async (req, res) => {
  try {
    const { userId, date, newStatus, updatedBy } = req.body;

    // ✅ Properly define start and end of day for the given date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // ✅ Search using a date range
    const attendance = await Attendance.findOne({
      userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found for this date",
      });
    }

    // ✅ Update attendance fields
    attendance.status = newStatus;
    attendance.updatedBy = updatedBy;

    await attendance.save();

    res.json({
      success: true,
      message: "Attendance updated successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getTodayAttendance = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const dateParam = req.query.date;
    console.log(userId, dateParam);

    if (!dateParam) {
      return res.status(400).json({
        success: false,
        message: "Missing 'date' query parameter",
        today: null,
      });
    }

    const startOfDayLocal = new Date(dateParam);
    startOfDayLocal.setHours(0, 0, 0, 0);

    const endOfDayLocal = new Date(dateParam);
    endOfDayLocal.setHours(23, 59, 59, 999);

    const todayAttendance = await Attendance.findOne({
      userId,
      date: {
        $gte: startOfDayLocal,
        $lte: endOfDayLocal,
      },
    });

    if (!todayAttendance) {
      return res.status(404).json({
        success: false,
        message: "No attendance found for selected date.",
        today: null,
      });
    }

    return res.status(200).json({
      success: true,
      today: todayAttendance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance for selected date",
      error: error.message,
    });
  }
};
export const markCheckoutTime = async (req, res) => {
  try {
    const { userId, date } = req.body;

    if (!userId || !date) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or date",
      });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found for that date",
      });
    }

    attendance.checkOutTime = new Date(); // set to now
    await attendance.save();

    return res.status(200).json({
      success: true,
      message: "Checkout time updated successfully",
      attendance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating checkout time",
      error: error.message,
    });
  }
};
