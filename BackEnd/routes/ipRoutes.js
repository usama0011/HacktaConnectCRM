import express from "express";
import { submitIPData, getUserIPData } from "../controllers/ipController.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Submit Daily Clicks & Sessions
router.post("/submit", authMiddleware, submitIPData);

// Get User's IP Submission Data
router.get("/:userId", authMiddleware, getUserIPData);

export default router;
