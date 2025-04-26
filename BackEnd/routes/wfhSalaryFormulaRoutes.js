import express from "express";
import {
  saveWFHSalaryFormula,
  getWFHSalaryFormula,
  updateWFHSalaryFormula,
} from "../controllers/wfhSalaryFormulaController.js";

const router = express.Router();

// Save or Update WFH Formula
router.post("/", saveWFHSalaryFormula);
router.put("/", updateWFHSalaryFormula);

// Get WFH Formula
router.get("/", getWFHSalaryFormula);

export default router;
