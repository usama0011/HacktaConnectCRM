import express from "express";
import {
  assignTask,
  getAllTasks,
  getSingleTask,
  getTasksByUsername,
} from "../controllers/taskController.js";
const router = express.Router();

// POST route to assign task
router.post("/assign", assignTask);
router.get("/all", getAllTasks); // ✅ View all tasks
router.get("/:id", getSingleTask); // ✅ New single-task route
router.get("/user/:username", getTasksByUsername);

export default router;
