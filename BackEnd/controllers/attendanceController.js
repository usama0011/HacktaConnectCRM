import Attendance from "../models/attendanceModel.js";
import moment from "moment"; // install moment if not already installed

// **Mark User Attendance**
// controllers/attendanceController.js
export const markAttendance = async (req, res) => {
  const { userId, username } = req.body;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if today's attendance already exists
    let attendance = await Attendance.findOne({ userId, date: today });

    if (!attendance) {
      // ✅ Only create if no record for today
      attendance = new Attendance({
        userId,
        username,
        date: today,
        checkInTime: new Date(),
      });

      await attendance.save();
      return res.status(201).json({
        message: "Attendance marked for today",
        attendance,
      });
    } else {
      // ⚠️ Already submitted
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

// **Get Attendance for a Specific User**

export const getAttendanceByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Fetch all records for the user
    const attendanceRecords = await Attendance.find({ userId }).sort({
      date: -1,
    });

    if (!attendanceRecords.length) {
      return res
        .status(404)
        .json({ success: false, message: "No records found" });
    }

    // 2. Today's Record
    const todayDate = moment().startOf("day");
    const todayRecord = attendanceRecords.find((record) =>
      moment(record.date).isSame(todayDate, "day")
    );

    // 3. Month Summary
    const currentMonth = moment().month();
    const monthlyRecords = attendanceRecords.filter(
      (record) => moment(record.date).month() === currentMonth
    );

    let present = 0,
      absent = 0,
      late = 0;
    monthlyRecords.forEach((rec) => {
      if (rec.status === "Present") present++;
      else if (rec.status === "Absent") absent++;
      else if (rec.status === "Late") late++;
    });

    const summary = {
      present,
      absent,
      late,
      total: monthlyRecords.length,
    };

    // 4. Final Response
    res.json({
      success: true,
      userAttendance: {
        today: {
          checkInTime: todayRecord?.checkInTime || null,
          status: todayRecord?.status || "Absent", // Default if no record
        },
        monthSummary: summary,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateAttendanceStatus = async (req, res) => {
  try {
    const { userId, date, newStatus, updatedBy } = req.body;

    const attendance = await Attendance.findOne({
      userId,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lte: new Date(date).setHours(23, 59, 59, 999),
      },
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found for this date",
      });
    }

    attendance.status = newStatus;
    attendance.updatedBy = updatedBy;

    await attendance.save();

    res.json({
      success: true,
      message: "Attendance updated successfully",
      attendance,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
