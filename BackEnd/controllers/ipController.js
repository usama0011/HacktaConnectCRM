import IP from "../models/ipmodel.js";
import User from "../models/usermodel.js";
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
