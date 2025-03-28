import express from "express";
import {
  saveDraftSalary,
  updateSalary,
  finalizeSalary,
  getUserSalaryHistory,
} from "../controllers/salaryController.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Save Draft Salary for Review (Admin)
router.post("/save-draft", authMiddleware, adminMiddleware, saveDraftSalary);

// Update Draft Salary (Admin Edits)
router.put("/update/:salaryId", authMiddleware, adminMiddleware, updateSalary);

// Finalize Salary After Review
router.post(
  "/finalize/:month",
  authMiddleware,
  adminMiddleware,
  finalizeSalary
);

// Get User Salary History
router.get("/:userId", authMiddleware, getUserSalaryHistory);

export default router;
