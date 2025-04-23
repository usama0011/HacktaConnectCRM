// routes/agentSalaryFormulaRoutes.js
import express from "express";
import {
  createOrUpdateFormula,
  getFormula,
} from "./agentSalaryFormulaController.js";

const router = express.Router();

router.get("/", getFormula);
router.post("/", createOrUpdateFormula);

export default router;
