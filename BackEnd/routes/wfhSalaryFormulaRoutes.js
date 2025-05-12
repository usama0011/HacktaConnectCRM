import express from "express";
import {
  saveWFHSalaryFormula,
  getWFHSalaryFormula,
  updateWFHSalaryFormula,
} from "../controllers/wfhSalaryFormulaController.js";
import { adminSideAuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Save or Update WFH Formula
router.post("/",adminSideAuthMiddleware, saveWFHSalaryFormula);
router.put("/", adminSideAuthMiddleware,updateWFHSalaryFormula);

// Get WFH Formula
router.get("/", getWFHSalaryFormula);

export default router;
