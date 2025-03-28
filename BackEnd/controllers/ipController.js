import IP from "../models/ipmodel.js";

// **Submit Daily Clicks & Sessions**
export const submitIPData = async (req, res) => {
  const { userId, clicks, sessions } = req.body;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let ipData = await IP.findOne({ userId, date: today });

    if (!ipData) {
      ipData = new IP({
        userId,
        username: req.user.username,
        clicks,
        sessions,
      });
    } else {
      ipData.clicks += clicks;
      ipData.sessions += sessions;
    }

    await ipData.save();
    res.json({ message: "IP Submission recorded successfully", ipData });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// **Get User's IP Submission Data**
export const getUserIPData = async (req, res) => {
  try {
    const { userId } = req.params;
    const ipRecords = await IP.find({ userId }).sort({ date: -1 });

    res.json({ success: true, ipRecords });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
