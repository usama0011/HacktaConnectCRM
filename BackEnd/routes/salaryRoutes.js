import express from "express";
import { calculateAgentSalaries } from "../controllers/salaryController.js";

const router = express.Router();

router.get("/calculate", calculateAgentSalaries);

export default router;
