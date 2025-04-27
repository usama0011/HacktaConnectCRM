// routes/salaryDownloadRoutes.js
import express from "express";
import { downloadSalarySheet } from "../controllers/downloadsalarycontroller.js";

const router = express.Router();

// Download Salary Sheet route
router.get("/download-sheet", downloadSalarySheet);

export default router;
