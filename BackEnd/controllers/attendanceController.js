import Attendance from "../models/attendanceModel.js";

// **Mark User Attendance**
export const markAttendance = async (req, res) => {
  const { userId } = req.body;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({ userId, date: today });

    if (!attendance) {
      attendance = new Attendance({
        userId,
        username: req.user.username,
        status: "Present",
        checkInTime: new Date(),
      });

      await attendance.save();
    } else {
      attendance.checkOutTime = new Date();
      await attendance.save();
    }

    res.json({ message: "Attendance marked successfully", attendance });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking attendance", error: error.message });
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
