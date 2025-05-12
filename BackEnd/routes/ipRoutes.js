import express from "express";
import {
  submitIPData,
  getUserIPData,
  getAllIPData,
  getDashboardSessionsClicksNew,
  getMonthlyIPCounts,
  getDailyAgentIPsWithHistory,
  updateAgentIPWithHistory,
  getAgentsMonthlyIPs,
} from "../controllers/ipController.js";
import { adminSideAuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/submit", submitIPData);
router.get("/daily-reports", adminSideAuthMiddleware, getDailyAgentIPsWithHistory);
router.get("/myagentsagents/monthly", adminSideAuthMiddleware, getAgentsMonthlyIPs); // 🥇 move this UP
router.get("/getcardssummery/:userId", getDashboardSessionsClicksNew);
router.get("/monthlyips/:userId", getMonthlyIPCounts);
router.get("/:userId", getUserIPData); // 🥲 generic param last!
router.get("/", getAllIPData);

router.put("/update-ip/:id", updateAgentIPWithHistory);

export default router;
