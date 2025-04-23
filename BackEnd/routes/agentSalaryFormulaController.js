// controllers/agentSalaryFormulaController.js
import AgentSalaryFormula from "../models/AgentSalaryFormula.js";

export const getFormula = async (req, res) => {
  try {
    const formula = await AgentSalaryFormula.findOne();
    if (!formula) return res.status(404).json({ message: "No formula found" });
    res.status(200).json(formula);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrUpdateFormula = async (req, res) => {
  try {
    const existing = await AgentSalaryFormula.findOne();
    if (existing) {
      const updated = await AgentSalaryFormula.findByIdAndUpdate(
        existing._id,
        req.body,
        { new: true }
      );
      return res
        .status(200)
        .json({ message: "Formula updated", data: updated });
    } else {
      const created = await AgentSalaryFormula.create(req.body);
      return res
        .status(201)
        .json({ message: "Formula created", data: created });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
