// models/AgentSalaryFormula.js
import mongoose from "mongoose";

const agentSalaryFormulaSchema = new mongoose.Schema(
  {
    sessionCost: { type: Number, required: true },
    clickCost: { type: Number, required: true },
    qcPoints110Cost: { type: Number, required: true },
    qcPoints120Cost: { type: Number, required: true },
    qcPoints130Cost: { type: Number, required: true },
    absentDetectionCount: { type: Number, default: 0, required: true },
  },
  { timestamps: true }
);

const AgentSalaryFormula = mongoose.model(
  "AgentSalaryFormula",
  agentSalaryFormulaSchema
);

export default AgentSalaryFormula;
