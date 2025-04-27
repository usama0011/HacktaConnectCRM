import express from "express";
import axios from "axios";

const router = express.Router();

// No need to keep secret, you are calling Decodo public API with a public key
const DECODO_API_URL = "https://api.decodo.com/v2/subscriptions";
const DECODO_API_KEY =
  "13d48119ba2c29771cb0a8bbadd304e19952266099c9c29020bbb5296911e38bf36bbfaa7ee84eaf34d53a48ee653f921d06971a07befb824ea590ebe46cca624ee653e0a1231b591ee663d3e305";

// GET subscription info
router.get("/subscriptions", async (req, res) => {
  try {
    const response = await axios.get(
      `${DECODO_API_URL}?api-key=${DECODO_API_KEY}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching Decodo subscriptions:",
      error?.response?.data || error.message
    );
    res
      .status(500)
      .json({ message: "Failed to fetch Decodo subscription data" });
  }
});

// Get All Whitelisted IPs
router.get("/whitelisted-ips", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.decodo.com/v2/whitelisted-ips?api-key=${DECODO_API_KEY}`,
      {
        headers: { accept: "application/json" },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching whitelisted IPs:", error.message);
    res.status(500).json({ message: "Failed to fetch whitelist IPs" });
  }
});

// Add New Whitelisted IP
router.post("/whitelisted-ips", async (req, res) => {
  try {
    const { ip, tag } = req.body;
    const response = await axios.post(
      `https://api.decodo.com/v2/whitelisted-ips?api-key=${DECODO_API_KEY}`,
      {
        IPAddressList: [ip],
        tag: tag || "", // If tag is empty, send empty string (optional)
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error adding whitelist IP:", error.message);
    res.status(500).json({ message: "Failed to add whitelist IP" });
  }
});

// Delete Whitelisted IP by ID
router.delete("/whitelisted-ips/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const response = await axios.delete(
      `https://api.decodo.com/v2/whitelisted-ips/${id}?api-key=${DECODO_API_KEY}`,
      {
        headers: { accept: "application/json" },
      }
    );
    res.json({ message: "IP deleted successfully" });
  } catch (error) {
    console.error("Error deleting whitelist IP:", error.message);
    res.status(500).json({ message: "Failed to delete whitelist IP" });
  }
});

// Fetch Sub-Users
router.get("/sub-users", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.decodo.com/v2/sub-users?api-key=${DECODO_API_KEY}`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching sub-users:", error);
    res.status(500).json({ message: "Failed to fetch sub-users" });
  }
});
export default router;
