import express from "express";
import { calculateSalaries } from "../controllers/salaryController.js";

const router = express.Router();

router.get("/calculate", calculateSalaries);

export default router;
