import express from "express";
import {
  getMonthlyQCPointsSummary,
  getQCPointsByDate,
  getTopAgentsLeaderboard,
  getUserQCByMonth,
  updateQCPointByUsernameAndId,
  upsertQCPoint,
} from "../controllers/qcPointController.js";
import { adminSideAuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",adminSideAuthMiddleware, getQCPointsByDate); // GET /api/qcpoints?date=2025-04-07
router.post("/", upsertQCPoint); // POST /api/qcpoints
router.get("/monthly-summary", adminSideAuthMiddleware, getMonthlyQCPointsSummary); // ✅ new route
router.get("/user/:username", getUserQCByMonth);
router.get("/topagents", adminSideAuthMiddleware, getTopAgentsLeaderboard);
router.put("/update/:username/:qcId", adminSideAuthMiddleware, updateQCPointByUsernameAndId);

export default router;
