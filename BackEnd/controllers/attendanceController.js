import Attendance from "../models/attendanceModel.js";
import User from "../models/usermodel.js";
import mongoose from "mongoose";
import moment from "moment";
import QCPoint from '../models/qcPointModel.js'

export const markAttendanceForAgent = async (req, res) => {
  const { userId, username,shift,agentType,branch } = req.body;

  try {
    // ✅ Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Only agents have attendance
    if (user.role !== "agent") {
      return res.status(403).json({ message: "Only agents have attendance." });
    }

    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // ✅ Check if attendance already exists for today
    let attendance = await Attendance.findOne({
      userId,
      date: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    });

    if (!attendance) {
      // ✅ Calculate status based on shift start time and current time
      const shiftStartTime = user.shiftStartTime; // e.g., "08:00 AM"
      const shiftStartDate = new Date();
      const [shiftHours, shiftMinutes] = shiftStartTime
        .split(/[:\s]/)
        .map((value) => parseInt(value));
      const isPM = shiftStartTime.includes("PM");
      shiftStartDate.setHours(isPM ? (shiftHours % 12) + 12 : shiftHours);
      shiftStartDate.setMinutes(shiftMinutes);
      shiftStartDate.setSeconds(0);

      // ✅ Calculate the difference in minutes between now and shift start
      const timeDifferenceInMinutes = Math.floor(
        (now - shiftStartDate) / (1000 * 60)
      );

      // ✅ Set status based on delay (Late if > 40 minutes)
      const status = timeDifferenceInMinutes > 40 ? "Late" : "pending";

      // ✅ Create attendance with calculated status
      attendance = new Attendance({
        userId,
        username,
        shift,
        agentType,
        branch,
        date: now,
        checkInTime: now,
        status, // ✅ Set as "Late" or "pending"
      });

      await attendance.save();
       if (status === "Late") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingQC = await QCPoint.findOne({
          userId,
          date: { $gte: todayStart, $lte: todayEnd },
        });

        if (!existingQC) {
          const qcPoint = new QCPoint({
            userId,
            date: now,
            name: username,
            avatar: user.userImage || "",
            shift,
            agentType,
            branch,
            time: "0", // ✅ Only this is filled
            profilePattern: "",
            pacePerHour: "",
            perHourReport: "",
            workingBehavior: "",
            totalPoints: 0,
            editedBy: "Auto-Late",
            history: [
              {
                action: "Created (Auto Late)",
                by: "System",
                timestamp: new Date().toLocaleString(),
              },
            ],
          });

          await qcPoint.save();
        }
      }
      return res.status(201).json({
        message: `Attendance marked as '${status}' for today`,
        attendance,
      });
    }

    // ✅ If attendance already exists
    return res.status(200).json({
      message: "Attendance already marked for today",
      attendance,
    });
  } catch (error) {
    console.error("Error marking attendance for agent:", error);
    res.status(500).json({
      message: "Error marking attendance",
      error: error.message,
    });
  }
};

export const getTodayAttendance = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    console.log(req.params.userId)
    const dateParam = req.query.date;

    if (!dateParam) {
      return res.status(400).json({
        success: false,
        message: "Missing 'date' query parameter",
        today: null,
      });
    }

    // 🔥 Create UTC-based range explicitly
    const startOfDayUTC = new Date(`${dateParam}T00:00:00.000Z`);
    const endOfDayUTC = new Date(`${dateParam}T23:59:59.999Z`);

    const todayAttendance = await Attendance.findOne({
      userId,
      date: {
        $gte: startOfDayUTC,
        $lte: endOfDayUTC,
      },
    });
   console.log(todayAttendance)
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

// ✅ Controller for Agent Checkout
export const agentCheckout = async (req, res) => {
  const { userId } = req.body;

  try {
    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // ✅ Check if attendance exists for today
    let attendance = await Attendance.findOne({
      userId,
      date: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found for today. Please mark attendance first.",
      });
    }

    // ✅ Update the checkout time
    attendance.checkOutTime = now;
    await attendance.save();

    return res.status(200).json({
      success: true,
      message: "Checkout time recorded successfully.",
      attendance,
    });
  } catch (error) {
    console.error("Error during agent checkout:", error);
    res.status(500).json({
      message: "Error during agent checkout",
      error: error.message,
    });
  }
};
// ✅ Controller to Update Attendance Status
export const updateAttendanceStatus = async (req, res) => {
  const { userId, date, newStatus, updatedBy } = req.body;

  try {
    // ✅ Validate new status
    const validStatuses = ["Present", "Absent", "Late", "Leave", "RotationOff", "Pending"];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance status provided.",
      });
    }

    // ✅ Define the date range for the specified day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // ✅ Find the attendance record for the user on the specified date
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
        message: "Attendance record not found for this date.",
      });
    }

    // ✅ Update the status
    attendance.status = newStatus;
    attendance.updatedBy = updatedBy;
    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Attendance status updated successfully.",
      attendance,
    });
  } catch (error) {
    console.error("Error updating attendance status:", error);
    res.status(500).json({
      message: "Error updating attendance status.",
      error: error.message,
    });
  }
};


export const getAllUsersAttendance = async (req, res) => {
  const { date, shift, agentType, branch,username } = req.query;

  try {
    const selectedMonth = new Date(date);
    const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0, 23, 59, 59, 999);

    const userQuery = { role: "agent" };
    if (shift) userQuery.shift = shift;
    if (agentType) userQuery.agentType = agentType;
    if (branch) userQuery.branch = branch;
if (username) userQuery.username = { $regex: username, $options: "i" }; // case-insensitive partial match

    if (req.user.role === "Team Lead") {
      userQuery.shift = req.user.shift;
      if (req.user.agentType) {
        userQuery.agentType = req.user.agentType;
      }
  }

    const users = await User.find(userQuery, "_id username userImage shift agentType branch");

    const attendanceRecords = await Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(moment(startOfMonth).startOf("day").toISOString()),
            $lte: new Date(moment(endOfMonth).endOf("day").toISOString()),
          },
        },
      },
      {
        $group: {
          _id: "$userId",
          records: {
            $push: {
              status: "$status",
              date: "$date",
            },
          },
        },
      },
    ]);

    const attendanceData = users.map((user) => {
      const userAttendance = attendanceRecords.find(
        (record) => record._id.toString() === user._id.toString()
      );

      const today = moment().startOf("day").toDate();
      const tomorrow = moment(today).add(1, "day").toDate();

      const todayStatus = userAttendance?.records.find((record) => {
        const recDate = new Date(record.date);
        return recDate >= today && recDate < tomorrow;
      })?.status || "pending";

      const monthSummary = {
        present: 0,
        absent: 0,
        late: 0,
        leave: 0,
        rotationOff: 0,
      };

      if (userAttendance) {
        userAttendance.records.forEach((record) => {
          if (record.status === "Present") monthSummary.present++;
          else if (record.status === "Absent") monthSummary.absent++;
          else if (record.status === "Late") monthSummary.late++;
          else if (record.status === "Leave") monthSummary.leave++;
          else if (record.status === "RotationOff") monthSummary.rotationOff++;
        });
      }

      return {
        id: user._id,
        user: {
          name: user.username,
          avatar: user.userImage || "https://i.pravatar.cc/50?u=default",
        },
        shift: user.shift,
        branch:user.branch,
        agentType: user.agentType || "N/A",
        todayStatus,
        monthSummary,
      };
    });

    const topPerformers = [...attendanceData]
      .sort((a, b) => b.monthSummary.present - a.monthSummary.present)
      .slice(0, 4)
      .map((performer) => ({
        id: performer.id,
        name: performer.user.name,
        avatar: performer.user.avatar,
        presentDays: performer.monthSummary.present,
        totalDays:
          performer.monthSummary.present +
          performer.monthSummary.absent +
          performer.monthSummary.late +
          performer.monthSummary.leave +
          performer.monthSummary.rotationOff,
      }));

    res.status(200).json({ attendanceData, topPerformers });
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    res.status(500).json({ message: "Failed to fetch attendance data", error: error.message });
  }
};



export const getSingleUserAttendance = async (req, res) => {
  const { userId } = req.params;
  const { date } = req.query;

  try {
    const selectedMonth = new Date(date);
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const user = await User.findById(userId, "username userImage shift agentType");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.user.role === "Team Lead") {
      if (
        user.shift !== req.user.shift ||
        (req.user.agentType && user.agentType !== req.user.agentType)
      ) {
        return res.status(403).json({
          message: "Access denied. Team Leads can only view users of their shift and type.",
        });
      }
    }

    const records = await Attendance.find({
      userId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    }).sort({ date: 1 });

    const recordMap = {};
    records.forEach((r) => {
      const key = r.date.toISOString().slice(0, 10);
      recordMap[key] = r;
    });

    const totalDays = new Date(year, month + 1, 0).getDate();
    const attendanceData = [];

    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      leave: 0,
      rotationOff: 0,
      total: totalDays,
    };

    for (let d = 1; d <= totalDays; d++) {
      const day = new Date(year, month, d);
      const key = day.toISOString().slice(0, 10);
      const record = recordMap[key];

      let entry;

      if (record) {
        const status = record.status.toLowerCase();

        // ✅ Treat both Present and Late as Present in summary
        if (status === "present" || status === "late") {
          stats.present++;
        }

        if (stats[status] !== undefined) {
          stats[status]++;
        }

        entry = {
          date: day,
          status: record.status,
          checkInTime: record.checkInTime?.toLocaleTimeString() || "-",
          checkOutTime: record.checkOutTime?.toLocaleTimeString() || "-",
        };
      } else {
        stats.absent++;
        entry = {
          date: day,
          status: "Absent",
          checkInTime: "-",
          checkOutTime: "-",
        };
      }

      attendanceData.push(entry);
    }

    return res.status(200).json({
      user: {
        name: user.username,
        avatar: user.userImage || "https://i.pravatar.cc/50?u=default",
        shift: user.shift,
        agentType: user.agentType || "N/A",
      },
      stats,
      attendanceData,
    });
  } catch (error) {
    console.error("Error fetching single user attendance:", error);
    res.status(500).json({
      message: "Failed to fetch attendance data",
      error: error.message,
    });
  }
};

