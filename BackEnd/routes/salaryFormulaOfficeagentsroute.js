import express from "express";
import {
  getSalaryFormula,
  saveSalaryFormula,
  updateSalaryFormula,
} from "../controllers/salaryFormulaControllerOfficeAgents.js";

const router = express.Router();

// Save or Update
router.post("/", saveSalaryFormula);

router.put("/", updateSalaryFormula); // ✅ New Route

router.get("/", getSalaryFormula);

export default router;
