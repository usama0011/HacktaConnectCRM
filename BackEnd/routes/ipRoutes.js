import express from "express";
import {
  submitIPData,
  getUserIPData,
  getAllIPData,
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

export default router;
