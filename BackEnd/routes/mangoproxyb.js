import express from "express";
import axios from "axios";
import { adminSideAuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

const MANGO_API_KEY =
  "mango_99fc7a3c8e2f7517a17208040c554eba671a6c1501392ff3bcff870086b815b4";

// GET Mango Proxy User Subscription Info
router.get("/subscriptions",adminSideAuthMiddleware, async (req, res) => {
  try {
    const response = await axios.get(
      "https://backend.mangoproxy.com/public-api/v1/user",
      {
        headers: {
          accept: "application/json",
          "x-api-key": MANGO_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching MangoProxy user info:", error.message);
    res.status(500).json({ message: "Failed to fetch user info" });
  }
});
// 🚀 New - Get Mango Traffic usage
router.get("/traffic", async (req, res) => {
  try {
    const response = await axios.get(
      "https://backend.mangoproxy.com/public-api/v1/traffic",
      {
        headers: {
          accept: "application/json",
          "x-api-key": MANGO_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching MangoProxy traffic info:", error.message);
    res.status(500).json({ message: "Failed to fetch traffic info" });
  }
});
export default router;
