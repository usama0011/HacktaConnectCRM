import express from "express";
import {
  submitIPData,
  getUserIPData,
  getAllIPData,
  getDashboardSessionsClicksNew,
  getMonthlyIPCounts,
  getDailyAgentIPsWithHistory,
  updateAgentIPWithHistory,
} from "../controllers/ipController.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Submit Daily Clicks & Sessions
router.post("/submit", submitIPData);
router.get("/", getAllIPData);

// Get User's IP Submission Data
router.get("/:userId", getUserIPData);
router.get("/getcardssummery/:userId", getDashboardSessionsClicksNew);
router.get("/monthlyips/:userId", getMonthlyIPCounts);

router.get("/daily-reports", getDailyAgentIPsWithHistory);

router.put("/update-ip/:id", updateAgentIPWithHistory);

export default router;
