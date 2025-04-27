import mongoose from "mongoose";

const salaryFormulaSchema = new mongoose.Schema(
  {
    sessionCost: { type: Number, required: true },
    maxSalary: { type: Number, required: true },
    clickCost: { type: Number, required: true },
    qc110_119: { type: Number, required: true },
    qc120_129: { type: Number, required: true },
    qc130_139: { type: Number, required: true },
    qc140_149: { type: Number, required: true },
    qc150_plus: { type: Number, required: true },
    bonus: { type: Number, required: true },
    absentFine: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const SalaryFormulaOfficeAgents = mongoose.model(
  "SalaryFormulaAgentOffice",
  salaryFormulaSchema
);
export default SalaryFormulaOfficeAgents;
