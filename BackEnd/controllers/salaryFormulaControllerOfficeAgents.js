import SalaryFormulaOfficeAgents from "../models/OfficeAgentSalaryFormula.js";

// POST: Create or Update Formula
export const saveSalaryFormula = async (req, res) => {
  try {
    const data = req.body;

    let existing = await SalaryFormulaOfficeAgents.findOne();
    if (existing) {
      // Update existing formula
      await SalaryFormulaOfficeAgents.updateOne({}, data);
      res.json({ success: true, message: "Formula updated successfully" });
    } else {
      // Create new formula
      const formula = new SalaryFormulaOfficeAgents(data);
      await formula.save();
      res.json({ success: true, message: "Formula created successfully" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET: Fetch Current Formula
export const getSalaryFormula = async (req, res) => {
  try {
    const formula = await SalaryFormulaOfficeAgents.findOne();
    if (!formula) {
      return res
        .status(404)
        .json({ success: false, message: "No formula found" });
    }
    res.json({ success: true, formula });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// PUT: Update Formula (separate clean update route) ✅
export const updateSalaryFormula = async (req, res) => {
  try {
    const updateData = req.body;

    const formula = await SalaryFormulaOfficeAgents.findOne();
    if (!formula) {
      return res
        .status(404)
        .json({ success: false, message: "No formula found to update" });
    }

    await SalaryFormulaOfficeAgents.updateOne({}, updateData);

    res.json({ success: true, message: "Formula updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
