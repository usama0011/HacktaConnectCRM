import mongoose from "mongoose";

const wfhSalaryFormulaSchema = new mongoose.Schema(
  {
    sessionCost: { type: Number, required: true },
    clickCost: { type: Number, required: true },
    bonus: { type: Number, required: true },
    absentFine: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const WFHSalaryFormula = mongoose.model(
  "WFHSalaryFormula",
  wfhSalaryFormulaSchema
);

export default WFHSalaryFormula;
