import User from "../models/usermodel.js";
import IP from "../models/ipmodel.js";
import Attendance from "../models/attendanceModel.js";
import Salary from "../models/salaryModel.js";

// **Get Reports for All Users on a Specific Date**
export const getUsersReport = async (req, res) => {
  try {
    const { year, month, day } = req.params;
    const dateFilter = new Date(`${year}-${month}-${day}`);

    const users = await User.find();

    let reports = [];

    for (const user of users) {
      const ipData = (await IP.findOne({
        userId: user._id,
        date: dateFilter,
      })) || { clicks: 0, sessions: 0 };
      const attendance = (await Attendance.findOne({
        userId: user._id,
        date: dateFilter,
      })) || { status: "Absent", checkInTime: null, checkOutTime: null };
      const salary = (await Salary.findOne({
        userId: user._id,
        month: `${year}-${month}`,
      })) || { totalSalary: 0 };

      reports.push({
        userId: user._id,
        username: user.username,
        role: user.role,
        shift: user.shift,
        totalClicks: ipData.clicks,
        totalSessions: ipData.sessions,
        totalCount: ipData.clicks + ipData.sessions,
        totalSalary: salary.totalSalary,
        attendanceStatus: attendance.status,
        loginTime: attendance.checkInTime,
        logoutTime: attendance.checkOutTime,
      });
    }

    res.json({ success: true, reports });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// **Get Detailed Report for a Specific User on a Specific Date**
export const getUserReportByDate = async (req, res) => {
  try {
    const { userId, year, month, day } = req.params;
    const dateFilter = new Date(`${year}-${month}-${day}`);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const ipData = (await IP.findOne({ userId, date: dateFilter })) || {
      clicks: 0,
      sessions: 0,
    };
    const attendance = (await Attendance.findOne({
      userId,
      date: dateFilter,
    })) || { status: "Absent", checkInTime: null, checkOutTime: null };
    const salary = (await Salary.findOne({
      userId,
      month: `${year}-${month}`,
    })) || { totalSalary: 0 };

    const report = {
      userId: user._id,
      username: user.username,
      role: user.role,
      shift: user.shift,
      totalClicks: ipData.clicks,
      totalSessions: ipData.sessions,
      totalCount: ipData.clicks + ipData.sessions,
      totalSalary: salary.totalSalary,
      attendanceStatus: attendance.status,
      loginTime: attendance.checkInTime,
      logoutTime: attendance.checkOutTime,
    };

    res.json({ success: true, report });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
