import express from "express";
import {
  getSalaryFormula,
  saveSalaryFormula,
  updateSalaryFormula,
} from "../controllers/salaryFormulaControllerOfficeAgents.js";
import { adminSideAuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Save or Update
router.post("/",adminSideAuthMiddleware, saveSalaryFormula);

router.put("/",adminSideAuthMiddleware, updateSalaryFormula); // ✅ New Route

router.get("/",adminSideAuthMiddleware, getSalaryFormula);

export default router;
