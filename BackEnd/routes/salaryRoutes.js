import express from "express";
import { calculateAgentSalaries } from "../controllers/salaryController.js";
import { adminSideAuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/calculate",adminSideAuthMiddleware, calculateAgentSalaries);

export default router;
