import IP from "../models/ipmodel.js";
import User from "../models/usermodel.js";
import moment from "moment";
import mongoose from "mongoose";
export const submitIPData = async (req, res) => {
  const { username, clicks, sessions, date, status } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const submissionDate = new Date(date);
    submissionDate.setHours(0, 0, 0, 0); // Normalize time

    // Check if data already exists for today
    const existing = await IP.findOne({
      userId: user._id,
      date: submissionDate,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "❌ Your work has already been submitted for today.",
      });
    }

    const ipData = new IP({
      userId: user._id,
      username: user.username,
      clicks,
      sessions,
      date: submissionDate,
      status,
    });

    await ipData.save();

    res.json({
      success: true,
      message: "✅ Work submitted successfully.",
      ipData,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// **Get User's IP Submission Data**
export const getUserIPData = async (req, res) => {
  try {
    const { userId } = req.params;
    const ipRecords = await IP.find({ userId })
      .sort({ date: -1 })
      .populate("userId", "userImage");

    res.json({ success: true, ipRecords });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
// Get All Users' IP Submission Data (Most Recent First)
export const getAllIPData = async (req, res) => {
  try {
    const ipRecords = await IP.find()
      .sort({ date: -1 })
      .populate("userId", "userImage"); // Populate username and image from User model
    res.json({ success: true, ipRecords });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching all IP records",
      error: error.message,
    });
  }
};

export const getDashboardSessionsClicks = async (req, res) => {
  try {
    const { year, month } = req.query;

    const startCurrent = moment(`${year}-${month}-01`)
      .startOf("month")
      .toDate();
    const endCurrent = moment(`${year}-${month}-01`).endOf("month").toDate();

    const lastMonth = moment(`${year}-${month}-01`).subtract(1, "month");
    const startLast = lastMonth.startOf("month").toDate();
    const endLast = lastMonth.endOf("month").toDate();

    const currentMonthData = await IP.aggregate([
      { $match: { date: { $gte: startCurrent, $lte: endCurrent } } },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: "$sessions" },
          totalClicks: { $sum: "$clicks" },
        },
      },
    ]);

    const lastMonthData = await IP.aggregate([
      { $match: { date: { $gte: startLast, $lte: endLast } } },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: "$sessions" },
          totalClicks: { $sum: "$clicks" },
        },
      },
    ]);

    const current = currentMonthData[0] || { totalSessions: 0, totalClicks: 0 };
    const last = lastMonthData[0] || { totalSessions: 0, totalClicks: 0 };

    const response = {
      sessions: {
        current: current.totalSessions,
        lastMonth: last.totalSessions,
        up: current.totalSessions >= last.totalSessions,
      },
      clicks: {
        current: current.totalClicks,
        lastMonth: last.totalClicks,
        up: current.totalClicks >= last.totalClicks,
      },
      ips: {
        current: current.totalSessions + current.totalClicks,
        lastMonth: last.totalSessions + last.totalClicks,
        up:
          current.totalSessions + current.totalClicks >=
          last.totalSessions + last.totalClicks,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Dashboard Sessions Clicks Error:", error);
    res.status(500).json({
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};

export const getDashboardSessionsClicksNew = async (req, res) => {
  try {
    const { year, month } = req.query;
    const { userId } = req.params; // ✅ Get userId from URL params

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const startCurrent = moment(`${year}-${month}-01`)
      .startOf("month")
      .toDate();
    const endCurrent = moment(`${year}-${month}-01`).endOf("month").toDate();

    const lastMonth = moment(`${year}-${month}-01`).subtract(1, "month");
    const startLast = lastMonth.startOf("month").toDate();
    const endLast = lastMonth.endOf("month").toDate();

    const currentMonthData = await IP.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId), // ✅ Match by userId
          date: { $gte: startCurrent, $lte: endCurrent },
        },
      },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: "$sessions" },
          totalClicks: { $sum: "$clicks" },
        },
      },
    ]);

    const lastMonthData = await IP.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startLast, $lte: endLast },
        },
      },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: "$sessions" },
          totalClicks: { $sum: "$clicks" },
        },
      },
    ]);

    const current = currentMonthData[0] || { totalSessions: 0, totalClicks: 0 };
    const last = lastMonthData[0] || { totalSessions: 0, totalClicks: 0 };

    const response = {
      sessions: {
        current: current.totalSessions,
        lastMonth: last.totalSessions,
        up: current.totalSessions >= last.totalSessions,
      },
      clicks: {
        current: current.totalClicks,
        lastMonth: last.totalClicks,
        up: current.totalClicks >= last.totalClicks,
      },
      ips: {
        current: current.totalSessions + current.totalClicks,
        lastMonth: last.totalSessions + last.totalClicks,
        up:
          current.totalSessions + current.totalClicks >=
          last.totalSessions + last.totalClicks,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Dashboard Sessions Clicks Error:", error);
    res.status(500).json({
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};

export const getMonthlyIPCounts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { year, month } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const startDate = moment(`${year}-${month}-01`).startOf("month").toDate();
    const endDate = moment(`${year}-${month}-01`).endOf("month").toDate();

    const data = await IP.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$date" },
            month: { $month: "$date" },
            year: { $year: "$date" },
          },
          totalSessions: { $sum: "$sessions" },
          totalClicks: { $sum: "$clicks" },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $concat: [
              { $toString: "$_id.day" },
              "-",
              { $toString: "$_id.month" },
              "-",
              { $toString: "$_id.year" },
            ],
          },
          totalIPs: { $add: ["$totalSessions", "$totalClicks"] },
        },
      },
      { $sort: { date: 1 } }, // Sort by date ascending
    ]);

    res.status(200).json(data);
  } catch (error) {
    console.error("Monthly IPs Error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch monthly IPs", error: error.message });
  }
};

export const getDailyAgentIPsWithHistory = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Date is required" });

    const startOfDay = moment(date).startOf("day").toDate();
    const endOfDay = moment(date).endOf("day").toDate();

    const records = await IP.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate("userId", "userImage") // Populate avatar if user has image
      .sort({ createdAt: -1 });

    const response = records.map((item) => ({
      _id: item._id,
      username: item.username,
      avatar: item.avatar || item.userId?.userImage || "",
      sessions: item.sessions,
      clicks: item.clicks,
      totalIPs: item.sessions + item.clicks,
      history: item.history || [],
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching daily agent IPs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAgentIPWithHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { sessions, clicks, editor } = req.body;

    const ipRecord = await IP.findById(id);
    if (!ipRecord) {
      return res.status(404).json({ message: "Record not found" });
    }

    // Save old value to history before update
    const newHistoryEntry = {
      editor: editor || "Unknown",
      timestamp: moment().format("YYYY-MM-DD hh:mm A"),
      sessions: ipRecord.sessions,
      clicks: ipRecord.clicks,
      isOriginal: false,
    };

    ipRecord.history = [...(ipRecord.history || []), newHistoryEntry];

    // Update main values
    ipRecord.sessions = sessions;
    ipRecord.clicks = clicks;

    await ipRecord.save();

    res.status(200).json({ message: "Record updated successfully" });
  } catch (error) {
    console.error("Error updating agent IP:", error);
    res.status(500).json({ message: "Server error" });
  }
};
