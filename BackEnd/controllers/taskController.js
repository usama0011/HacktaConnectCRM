import Task from "../models/taskModel.js";

// POST: Assign a task
export const assignTask = async (req, res) => {
  const {
    assignee,
    createdBy,
    participants,
    observers,
    deadline,
    startDate,
    finishDate,
    duration,
    taskSummary,
    taskImage, // ✅ include
  } = req.body;

  try {
    const newTask = new Task({
      assignee,
      createdBy,
      participants,
      observers,
      deadline,
      startDate,
      finishDate,
      duration,
      taskSummary,
      taskImage, // ✅ include
    });

    await newTask.save();

    res
      .status(201)
      .json({ message: "Task assigned successfully", task: newTask });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to assign task", error: error.message });
  }
};

// GET: View all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

// Get a single task by ID
export const getSingleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
