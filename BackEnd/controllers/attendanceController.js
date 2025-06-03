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
export const updateAttendanceStatus = async (req, res) => {
  const { userId, date, newStatus, updatedBy } = req.body;

  try {
    const validStatuses = ["Present", "Absent", "Late", "Leave", "RotationOff", "Pending"];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance status provided.",
      });
    }
const parsedDate = new Date(date);
const startOfDay = new Date(parsedDate);
startOfDay.setUTCHours(0, 0, 0, 0);

const endOfDay = new Date(parsedDate);
endOfDay.setUTCHours(23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found for this date.",
      });
    }

    const previousStatus = attendance.status;

    attendance.status = newStatus;
    attendance.updatedBy = updatedBy;
    attendance.editHistory.push({
      updatedBy,
      updatedAt: new Date(),
      previousStatus,
    });

    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Attendance status updated successfully.",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating attendance status.",
      error: error.message,
    });
  }
};


export const getAllUsersAttendance = async (req, res) => {
  const { date, shift, agentType, branch, username } = req.query;
  console.log(req.user)
  try {
    const { date } = req.query;
    const selectedMonth = new Date(date);
    const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0, 23, 59, 59, 999);

    // 🟡 Override filters for Team Leads / QC roles
    let { shift, agentType, branch, username } = req.query;

    if (
      req.user.role === "Team Lead" ||
      req.user.role === "Team Lead WFH" ||
      req.user.role === "QC"
    ) {
      branch = req.user.branch;
      shift = req.user.shift;
      // ✅ agentType is NOT enforced here — as requested
    }

    // Filters for user query
    const userQuery = { role: "agent" };
    if (shift) userQuery.shift = shift;
    if (agentType) userQuery.agentType = agentType;
    if (branch) userQuery.branch = branch;
    if (username) userQuery.username = { $regex: username, $options: "i" };

    // 1. Filtered Users
    const users = await User.find(userQuery, "_id username userImage shift agentType branch");

    // 2. Attendance records for filtered users
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

    // 3. Prepare attendanceData for filtered table
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
        branch: user.branch,
        agentType: user.agentType || "N/A",
        todayStatus,
        monthSummary,
      };
    });

    // 4. GLOBAL Top Performers (unfiltered)
    const allAgents = await User.find({ role: "agent" }, "_id username userImage");

    const allAttendance = await Attendance.aggregate([
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
            $push: { status: "$status" },
          },
        },
      },
    ]);

    const globalTopPerformers = allAgents.map((agent) => {
      const record = allAttendance.find(
        (r) => r._id.toString() === agent._id.toString()
      );

      let present = 0,
        absent = 0,
        late = 0,
        leave = 0,
        rotationOff = 0;

      if (record) {
        record.records.forEach((r) => {
          if (r.status === "Present") present++;
          else if (r.status === "Absent") absent++;
          else if (r.status === "Late") late++;
          else if (r.status === "Leave") leave++;
          else if (r.status === "RotationOff") rotationOff++;
        });
      }

      return {
        id: agent._id,
        name: agent.username,
        avatar: agent.userImage || "https://i.pravatar.cc/50?u=default",
        presentDays: present,
        totalDays: present + absent + late + leave + rotationOff,
      };
    });

    const topPerformers = globalTopPerformers
      .sort((a, b) => b.presentDays - a.presentDays)
      .slice(0, 3);

    // ✅ Final Response
    res.status(200).json({ attendanceData, topPerformers });
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    res.status(500).json({
      message: "Failed to fetch attendance data",
      error: error.message,
    });
  }
};


// ✅ Updated Controller: Get Full Month Attendance (fixed for timezone)
export const getSingleUserAttendance = async (req, res) => {
  const { userId } = req.params;
  const { date } = req.query;
  console.log("Requested user and date:", userId, date);

  try {
    const selectedMonth = new Date(date);
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth(); // 0-indexed

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const user = await User.findById(
      userId,
      "username userImage shift agentType branch"
    );
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // ✅ Restrict access if Team Lead (optional logic)
    if (req.user.role === "Team Lead") {
      if (
        user.shift !== req.user.shift ||
        (req.user.agentType && user.agentType !== req.user.agentType)
      ) {
        return res.status(403).json({
          message:
            "Access denied. Team Leads can only view users of their shift and type.",
        });
      }
    }

    // ✅ Fetch all attendance records for that month
    const records = await Attendance.find({
      userId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    }).sort({ date: 1 });

    // ✅ Convert records to map using Asia/Karachi timezone
    const recordMap = {};
    records.forEach((r) => {
      const key = new Date(r.date).toLocaleDateString("en-CA", {
        timeZone: "Asia/Karachi",
      });
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
  const dateKey = day.toLocaleDateString("en-CA", {
    timeZone: "Asia/Karachi",
  });
  const record = recordMap[dateKey];

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Karachi",
  });

  let entry;

  if (record) {
    const status = record.status.toLowerCase();

    if (status === "present" || status === "late") stats.present++;
    if (stats[status] !== undefined) stats[status]++;

    entry = {
      userId: record.userId,
      date: dateKey,
      status: record.status,
      checkInTime: record.checkInTime
        ? new Date(record.checkInTime).toLocaleTimeString("en-US", {
            timeZone: "Asia/Karachi",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "-",
      checkOutTime: record.checkOutTime
        ? new Date(record.checkOutTime).toLocaleTimeString("en-US", {
            timeZone: "Asia/Karachi",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "-",
      editHistory: record.editHistory || [],
    };
  } else {
    // ✅ If future date → PENDING
    const isFuture = new Date(dateKey) > new Date(today);
    const defaultStatus = isFuture ? "Pending" : "Absent";

    if (!isFuture) stats.absent++;

    entry = {
      date: dateKey,
      status: defaultStatus,
      checkInTime: "-",
      checkOutTime: "-",
    };
  }

  attendanceData.push(entry);
}


    // ✅ Send final response
    return res.status(200).json({
      user: {
        _id: user._id,
        name: user.username,
        avatar: user.userImage || "https://i.pravatar.cc/50?u=default",
        shift: user.shift,
        branch: user.branch,
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


export const adminCreateAttendance = async (req, res) => {
  const { userId, username, shift, agentType, branch, date, status, checkInTime, checkOutTime, updatedBy } = req.body;

  try {
    const existing = await Attendance.findOne({
      userId,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lte: new Date(date).setHours(23, 59, 59, 999),
      },
    });

    if (existing) {
      return res.status(400).json({ message: "Attendance already exists for this date." });
    }

    const attendance = new Attendance({
      userId,
      username,
      shift,
      agentType,
      branch,
      date: new Date(date),
      status,
      checkInTime: checkInTime ? new Date(checkInTime) : null,
      checkOutTime: checkOutTime ? new Date(checkOutTime) : null,
      updatedBy,
      editHistory: [
        {
          updatedBy,
          updatedAt: new Date(),
          previousStatus: `Created as ${status}`,
        },
      ],
    });

    await attendance.save();

    return res.status(201).json({
      message: "Attendance successfully created by Admin.",
      attendance,
    });
  } catch (error) {
    console.error("Admin create attendance error:", error);
    res.status(500).json({
      message: "Failed to create attendance.",
      error: error.message,
    });
  }
};
