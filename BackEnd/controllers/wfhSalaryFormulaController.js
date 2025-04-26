import WFHSalaryFormula from "../models/wfhSalaryFormulaModel.js";

// POST: Save or Update WFH Formula
export const saveWFHSalaryFormula = async (req, res) => {
  try {
    const data = req.body;

    let existing = await WFHSalaryFormula.findOne();
    if (existing) {
      await WFHSalaryFormula.updateOne({}, data);
      res.json({ success: true, message: "WFH Formula updated successfully" });
    } else {
      const formula = new WFHSalaryFormula(data);
      await formula.save();
      res.json({ success: true, message: "WFH Formula created successfully" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET: Fetch Current WFH Formula
export const getWFHSalaryFormula = async (req, res) => {
  try {
    const formula = await WFHSalaryFormula.findOne();
    if (!formula) {
      return res
        .status(404)
        .json({ success: false, message: "No WFH formula found" });
    }
    res.json({ success: true, formula });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT: Update WFH Formula (explicit PUT route)
export const updateWFHSalaryFormula = async (req, res) => {
  try {
    const data = req.body;

    let existing = await WFHSalaryFormula.findOne();
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "WFH formula not found to update" });
    }

    await WFHSalaryFormula.updateOne({}, data);

    res.json({ success: true, message: "WFH Formula updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
