import mongoose from "mongoose";

// Salary Schema (Updated)
const salarySchema = new mongoose.Schema(
  {

    // ✅ New Fieds Based on Your List
    accountTitle: { type: String, required: true }, // Name of salary receiver
    bank: { type: String, required: true },         // Bank name (e.g., HBL)
    accountNumber: { type: String, required: true },// Valid account number
    salary: { type: Number, required: true },       // Numeric amount

    shift: {
      type: String,
      enum: ["morning", "evening", "night"],
      required: true,
    },
    agentType: {
      type: String,
      enum: ["Office Agent", "WFH Agent"],
      required: true,
    },
    branch: {
      type: String,
      enum: ["Branch A", "Branch B"],
      required: true,
    },

    month: { type: String, required: true }, // Format: YYYY-MM

    // Optional tracking fields
    totalClicks: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    totalSalary: { type: Number, required: true }, // could be same as 'salary' or include bonuses

    status: {
      type: String,
      enum: ["Pending", "Finalized"],
      default: "Pending",
    },

    createdBy: { type: String }, // Optional: Who uploaded this record
  },
  {
    timestamps: true,
  }
);

const Salary = mongoose.model("Salary", salarySchema);

export default Salary;
