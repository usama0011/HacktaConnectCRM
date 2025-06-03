import express from "express";
import { calculateAgentSalaries, getMonthlyBranchSalarySummary } from "../controllers/salaryController.js";
import { adminSideAuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/calculate",adminSideAuthMiddleware, calculateAgentSalaries);
router.get("/branch-monthly-salary-summary", getMonthlyBranchSalarySummary);

export default router;
