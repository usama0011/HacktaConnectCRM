import Attendance from "../models/attendanceModel.js";

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
    const attendanceRecords = await Attendance.find({ userId }).sort({
      date: -1,
    });

    res.json({ success: true, attendanceRecords });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
