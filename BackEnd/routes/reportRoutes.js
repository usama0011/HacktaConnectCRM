import express from "express";
import {
  getUsersReport,
  getUserReportByDate,
} from "../controllers/reportController.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// **Get All Users' Reports for a Specific Date**
router.get("/users/:year/:month/:day", authMiddleware, getUsersReport);

// **Get Detailed Report for a Specific User on a Specific Date**
router.get(
  "/user/:userId/:year/:month/:day",
  authMiddleware,
  getUserReportByDate
);

export default router;
