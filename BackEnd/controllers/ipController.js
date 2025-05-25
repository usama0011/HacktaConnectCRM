import IP from "../models/ipmodel.js";
import User from "../models/usermodel.js";
import moment from "moment";
import mongoose from "mongoose";
export const submitIPData = async (req, res) => {
  const { username, clicks, sessions, date, status,shift,agentType,branch } = req.body;

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
      shift,
      agentType,
      branch
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

    // Validation
    if (!userId || !year || !month) {
      return res.status(400).json({ message: "User ID, Year, and Month are required." });
    }

    const monthInt = parseInt(month, 10);
    if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
      return res.status(400).json({ message: "Invalid month value." });
    }

    const userObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : null;

    if (!userObjectId) {
      return res.status(400).json({ message: "Invalid User ID." });
    }

    const paddedMonth = String(monthInt).padStart(2, "0");
    const startDate = moment(`${year}-${paddedMonth}-01`, "YYYY-MM-DD").startOf("month").toDate();
    const endDate = moment(`${year}-${paddedMonth}-01`, "YYYY-MM-DD").endOf("month").toDate();

    // Fetch user info
    const user = await User.findById(userObjectId, "username userImage");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch all IP records for that user in the month
    const ipRecords = await IP.find({
      userId: userObjectId,
      date: { $gte: startDate, $lte: endDate },
    });

    const totalDays = moment(`${year}-${monthInt}`, "YYYY-M").daysInMonth();
    const fullMonth = [];

    for (let day = 1; day <= totalDays; day++) {
      const currentDate = moment(`${year}-${monthInt}-${day}`, "YYYY-M-D").toDate();

      const matchingRecord = ipRecords.find((entry) =>
        moment(entry.date).isSame(currentDate, "day")
      );

      fullMonth.push({
        userId:userId,
        date: `${day}-${monthInt}-${year}`,
        sessions: matchingRecord ? matchingRecord.sessions : 0,
        clicks: matchingRecord ? matchingRecord.clicks : 0,
        totalIPs: matchingRecord ? matchingRecord.sessions + matchingRecord.clicks : 0,
        history: matchingRecord?.history || [],
        username: user.username,
        avatar: user.userImage || "https://i.pravatar.cc/50?u=default",
      });
    }

    return res.status(200).json(fullMonth);
  } catch (error) {
    console.error("Monthly IPs Error:", error);
    return res.status(500).json({
      message: "Failed to fetch monthly IPs",
      error: error.message,
    });
  }
};
// ✅ Controller to Get Daily Agent IPs with History
export const getDailyAgentIPsWithHistory = async (req, res) => {
  try {
    const { date, shift, agentType, branch,username } = req.query;
    console.log(date)
    if (!date) return res.status(400).json({ message: "Date is required" });

    const startOfDay = moment(date).startOf("day").toDate();
    const endOfDay = moment(date).endOf("day").toDate();

    // Build base agent query
    const agentQuery = { role: "agent" };

    // Team Lead restrictions
    if (req.user.role === "Team Lead") {
      agentQuery.shift = req.user.shift;
      if (req.user.agentType) {
        agentQuery.agentType = req.user.agentType;
      }
    }

    // Apply additional filters from query params
    if (shift) agentQuery.shift = shift;
    if (agentType) agentQuery.agentType = agentType;
    if (branch) agentQuery.branch = branch;
if (username) {
  agentQuery.username = { $regex: req.query.username, $options: "i" };
}

    // Fetch Agents
    const agents = await User.find(
      agentQuery,
      "_id username userImage shift agentType branch"
    );

    if (!agents.length) {
      return res.status(404).json({ message: "No agents found" });
    }

    const agentIds = agents.map((agent) => agent._id);

    // Fetch IP records for the filtered agents and date
    const records = await IP.find({
      userId: { $in: agentIds },
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate("userId", "userImage")
      .sort({ createdAt: -1 });

    // Prepare final response
    const response = agents.map((agent) => {
  const ipRecord = records.find(
  (record) =>
    record.userId &&
    record.userId._id.toString() === agent._id.toString()
);


      return {
        _id: agent._id,
        userId: agent._id,          // ✅ User ID
        username: agent.username,
        avatar: agent.userImage || "https://i.pravatar.cc/50?u=default",
        shift: agent.shift,
        agentType: agent.agentType || "N/A",
        branch: agent.branch || "N/A",
        sessions: ipRecord ? ipRecord.sessions : 0,
        clicks: ipRecord ? ipRecord.clicks : 0,
        totalIPs: ipRecord ? ipRecord.sessions + ipRecord.clicks : 0,
        history: ipRecord ? ipRecord.history || [] : [],
      };
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching daily agent IPs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateAgentIPWithHistory = async (req, res) => {
  try {
    const { id } = req.params; // This must be userId
    const { sessions, clicks, editor, date } = req.body;
    console.log(id,sessions,clicks,editor,date)
    if (!date) return res.status(400).json({ message: "Date is required" });

    const startOfDay = moment(date).startOf("day").toDate();
    const endOfDay = moment(date).endOf("day").toDate();

    const ipRecord = await IP.findOne({
      userId: id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!ipRecord) {
      return res.status(404).json({ message: "Record not found" });
    }

    const newHistoryEntry = {
      editor: editor || "Unknown",
      timestamp: moment().format("YYYY-MM-DD hh:mm A"),
      sessions: ipRecord.sessions,
      clicks: ipRecord.clicks,
      isOriginal: false,
    };

    ipRecord.history.push(newHistoryEntry);
    ipRecord.sessions = sessions;
    ipRecord.clicks = clicks;

    await ipRecord.save();

    res.status(200).json({ message: "Record updated successfully" });
  } catch (error) {
    console.error("Error updating agent IP:", error);
    res.status(500).json({ message: "Server error", errmsg: error.message });
  }
};

// ✅ Controller to Get Agents' Monthly IPs
export const getAgentsMonthlyIPs = async (req, res) => {
  try {
const { year, month, shift, agentType, branch,username } = req.query;
    if (!year || !month) {
      return res
        .status(400)
        .json({ success: false, message: "Month and Year are required" });
    }

    const startOfMonth = moment(`${year}-${month}-01`).startOf("month").toDate();
    const endOfMonth = moment(`${year}-${month}-01`).endOf("month").toDate();

  const agentQuery = { role: "agent" };
if (shift) agentQuery.shift = shift;
if (agentType) agentQuery.agentType = agentType;
if (branch) agentQuery.branch = branch;
if (username) {
  agentQuery.username = { $regex: username, $options: "i" };
}
    // Restrict Team Lead to view only their shift and agent type agents
    if (req.user.role === "Team Lead") {
      agentQuery.shift = req.user.shift;
      if (req.user.agentType) {
        agentQuery.agentType = req.user.agentType;
      }
    }

    // Fetch Agents based on query
    const agents = await User.find(agentQuery, "username userImage shift agentType branch");
    if (!agents.length) {
      return res
        .status(404)
        .json({ success: false, message: "No agents found" });
    }

    const agentIds = agents.map((a) => a._id);

    // Find IP submissions for these agents during the month
    const ipRecords = await IP.aggregate([
      {
        $match: {
          userId: { $in: agentIds },
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: "$userId",
          totalClicks: { $sum: "$clicks" },
          totalSessions: { $sum: "$sessions" },
        },
      },
    ]);

    // Prepare Final Response
    const finalData = agents.map((agent) => {
      const ipData = ipRecords.find(
        (r) => r._id.toString() === agent._id.toString()
      ) || {
        totalClicks: 0,
        totalSessions: 0,
      };

      return {
        id: agent._id,
        username: agent.username,
        avatar: agent.userImage || "https://i.pravatar.cc/50?u=default",
        shift: agent.shift,
        agentType: agent.agentType || "N/A",
        totalClicks: ipData.totalClicks,
        totalSessions: ipData.totalSessions,
        totalIPs: ipData.totalClicks + ipData.totalSessions,
      };
    }); 
    // Step: Global Top 3 Based on Total IPs (clicks + sessions)
const globalTop3Raw = await IP.aggregate([
  {
    $match: {
      date: { $gte: startOfMonth, $lte: endOfMonth },
    },
  },
  {
    $group: {
      _id: "$userId",
      totalClicks: { $sum: "$clicks" },
      totalSessions: { $sum: "$sessions" },
    },
  },
  {
    $project: {
      userId: "$_id",
      totalClicks: 1,
      totalSessions: 1,
      totalIPs: { $add: ["$totalClicks", "$totalSessions"] },
    },
  },
  { $sort: { totalIPs: -1 } },
  { $limit: 3 },
]);

// Enrich with user info
const top3 = await Promise.all(
  globalTop3Raw.map(async (record) => {
    const user = await User.findById(record.userId, "username userImage shift agentType");
    return {
      id: user._id,
      username: user.username,
      avatar: user.userImage || "https://i.pravatar.cc/50?u=default",
      shift: user.shift,
      agentType: user.agentType || "N/A",
      totalClicks: record.totalClicks,
      totalSessions: record.totalSessions,
      totalIPs: record.totalIPs,
    };
  })
);

res.status(200).json({
  success: true,
  agents: finalData,  // Filtered table data
  top3,               // Global top 3 agents
});
  } catch (error) {
    console.error("Get Agents Monthly IPs Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

