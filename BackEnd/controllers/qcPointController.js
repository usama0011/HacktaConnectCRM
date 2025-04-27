import User from "../models/usermodel.js"; // import User model
import QCPoint from "../models/qcPointModel.js";
import moment from "moment";
import IP from "../models/ipmodel.js"; // ✅ Import IP model

export const getQCPointsByDate = async (req, res) => {
  try {
    const date = req.query.date; // ✅ Declare first

    const start = moment(date).startOf("day").toDate();
    const end = moment(date).endOf("day").toDate();
    const agents = await User.find({ role: "agent" });
    const points = await QCPoint.find({ date: { $gte: start, $lte: end } });

    const merged = agents.map((agent) => {
      const point = points.find(
        (p) => p.userId.toString() === agent._id.toString()
      );

      return {
        _id: agent._id,
        name: agent.username,
        avatar: agent.userImage,
        role: agent.role,
        shift: agent.shift,
        ...(point
          ? {
              ...point._doc,
              id: point._id, // for table rowKey
            }
          : {
              time: "",
              profilePattern: "",
              pacePerHour: "",
              perHourReport: "",
              workingBehavior: "",
              totalPoints: 0,
              editedBy: "",
              history: [],
            }),
      };
    });

    res.status(200).json(merged);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch points", error: error.message });
  }
};

export const upsertQCPoint = async (req, res) => {
  try {
    const { userId, date, values, editor, name, avatar } = req.body;

    const start = moment(date).startOf("day").toDate();
    const end = moment(date).endOf("day").toDate();

    const existing = await QCPoint.findOne({
      userId,
      date: { $gte: start, $lte: end },
    });

    const totalPoints = Object.values(values).filter((v) => v === "1").length;

    const historyEntry = {
      action: existing ? "Edited" : "Created",
      by: editor,
      timestamp: moment().format("DD MMMM, HH:mm"),
    };

    if (existing) {
      Object.assign(existing, values, {
        totalPoints,
        editedBy: editor,
        history: [...existing.history, historyEntry],
      });
      await existing.save();
      return res.status(200).json(existing);
    }

    const newPoint = new QCPoint({
      userId,
      date,
      name,
      avatar,
      ...values,
      totalPoints,
      editedBy: editor,
      history: [historyEntry],
    });

    await newPoint.save();
    res.status(201).json(newPoint);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to save QC Point", error: error.message });
  }
};

export const getMonthlyQCPointsSummary = async (req, res) => {
  try {
    const { year, month } = req.query;

    const start = moment(`${year}-${month}-01`).startOf("month").toDate();
    const end = moment(`${year}-${month}-01`).endOf("month").toDate();

    const summary = await QCPoint.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$name", // Group by user name
          totalPoints: { $sum: "$totalPoints" },
          avatar: { $first: "$avatar" },
        },
      },
      {
        $project: {
          name: "$_id",
          avatar: 1,
          totalPoints: 1,
          _id: 0,
        },
      },
      {
        $sort: { totalPoints: -1 }, // Sort by total points descending
      },
    ]);

    // Get Top 5 from the sorted summary
    const top5 = summary.slice(0, 5);

    res.status(200).json({
      summary,
      top5,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch monthly QC points",
      error: error.message,
    });
  }
};

export const getUserQCByMonth = async (req, res) => {
  try {
    const { username } = req.params;
    const { year, month } = req.query;

    const start = moment(`${year}-${month}-01`).startOf("month").toDate();
    const end = moment(`${year}-${month}-01`).endOf("month").toDate();

    const records = await QCPoint.find({
      name: username,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    const formatted = {
      name: username,
      avatar: records[0]?.avatar || "",
      points: records.map((r) => ({
        date: moment(r.date).format("YYYY-MM-DD"),
        time: r.time,
        profilePattern: r.profilePattern,
        pacePerHour: r.pacePerHour,
        perHourReport: r.perHourReport,
        workingBehavior: r.workingBehavior,
        totalPoints: r.totalPoints,
      })),
    };

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user's QC points",
      error: error.message,
    });
  }
};

export const getTopAgentsLeaderboard = async (req, res) => {
  try {
    const { year, month } = req.query;

    const startCurrent = moment(`${year}-${month}-01`)
      .startOf("month")
      .toDate();
    const endCurrent = moment(`${year}-${month}-01`).endOf("month").toDate();

    const lastMonth = moment(`${year}-${month}-01`).subtract(1, "month");
    const startLast = lastMonth.startOf("month").toDate();
    const endLast = lastMonth.endOf("month").toDate();

    // 1. Aggregate current month QC points
    const currentMonth = await QCPoint.aggregate([
      { $match: { date: { $gte: startCurrent, $lte: endCurrent } } },
      {
        $group: {
          _id: "$userId",
          totalPoints: { $sum: "$totalPoints" },
          avatar: { $first: "$avatar" },
          name: { $first: "$name" },
        },
      },
      { $sort: { totalPoints: -1 } },
      { $limit: 3 },
    ]);

    // 2. Aggregate last month QC points
    const lastMonthData = await QCPoint.aggregate([
      { $match: { date: { $gte: startLast, $lte: endLast } } },
      {
        $group: {
          _id: "$userId",
          totalPoints: { $sum: "$totalPoints" },
        },
      },
    ]);

    const lastMonthMap = {};
    lastMonthData.forEach((item) => {
      lastMonthMap[item._id.toString()] = item.totalPoints;
    });

    // 3. For each Top Agent → fetch full user + calculate current month IPs (sessions + clicks)
    const leaderboard = await Promise.all(
      currentMonth.map(async (agent, index) => {
        const user = await User.findById(agent._id);

        const lastPoints = lastMonthMap[agent._id.toString()] || 0;
        const changePercent =
          lastPoints === 0
            ? "N/A"
            : (((agent.totalPoints - lastPoints) / lastPoints) * 100).toFixed(
                2
              );

        // ✅ Now Fetch total Sessions + Clicks for current month for this agent
        const ipData = await IP.aggregate([
          {
            $match: {
              userId: agent._id,
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

        const totalSessions = ipData[0]?.totalSessions || 0;
        const totalClicks = ipData[0]?.totalClicks || 0;
        const totalIPs = totalSessions + totalClicks;

        return {
          rank: `#0${index + 1} Rank`,
          username: agent.name,
          avatar: user?.userImage || agent.avatar || "",
          shift: user?.shift || "Unknown",
          totalPoints: agent.totalPoints,
          lastMonthPoints: lastPoints,
          change: changePercent,
          changeType: agent.totalPoints >= lastPoints ? "up" : "down",
          totalIPs, // ✅ NEW
        };
      })
    );

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch leaderboard",
      error: error.message,
    });
  }
};
