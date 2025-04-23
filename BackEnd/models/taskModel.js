import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    assignee: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    participants: {
      type: [String],
      default: [],
    },
    observers: {
      type: [String],
      default: [],
    },
    deadline: {
      type: Date,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    finishDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    taskSummary: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    taskImage: { type: String }, // ✅ new field
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
