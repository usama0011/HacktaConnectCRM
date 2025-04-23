import express from "express";
import {
  getMonthlyQCPointsSummary,
  getQCPointsByDate,
  getUserQCByMonth,
  upsertQCPoint,
} from "../controllers/qcPointController.js";

const router = express.Router();

router.get("/", getQCPointsByDate); // GET /api/qcpoints?date=2025-04-07
router.post("/", upsertQCPoint); // POST /api/qcpoints
router.get("/monthly-summary", getMonthlyQCPointsSummary); // ✅ new route
router.get("/user/:username", getUserQCByMonth);

export default router;
