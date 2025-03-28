import mongoose from "mongoose";

// Salary Schema
const salarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: { type: String, required: true },
    month: { type: String, required: true }, // Format: YYYY-MM
    totalClicks: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    totalSalary: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Finalized"],
      default: "Pending",
    }, // Allow admin edits before finalizing
  },
  {
    timestamps: true,
  }
);

const Salary = mongoose.model("Salary", salarySchema);

export default Salary;
