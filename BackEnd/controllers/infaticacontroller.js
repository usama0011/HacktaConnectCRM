import axios from "axios";
export const getStatistics = async (req, res) => {
  try {
    const response = await axios.get("https://api.infatica.io/stats", {
      headers: {
        "api-key": "7cv9Bz2CZQvuWQL65OD6",
        "Content-Type": "application/json",
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching statistics:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch statistics", error: error.message });
  }
};