import SalaryFormulaOfficeAgents from "../models/OfficeAgentSalaryFormula.js";
import WFHSalaryFormula from "../models/wfhSalaryFormulaModel.js";

export const calculateGeneralSalary = async (req, res) => {
  try {
    const { agentType, clicks, sessions } = req.body;

    if (!agentType || clicks === undefined || sessions === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let formula;

    if (agentType === "Office Agent") {
      formula = await SalaryFormulaOfficeAgents.findOne().sort({
        createdAt: -1,
      });
    } else if (agentType === "WFH Agent") {
      formula = await WFHSalaryFormula.findOne().sort({ createdAt: -1 });
    } else {
      return res.status(400).json({ message: "Invalid agent type" });
    }

    if (!formula) {
      return res.status(404).json({ message: "Salary formula not found" });
    }

    const salary = clicks * formula.clickCost + sessions * formula.sessionCost;

    res.status(200).json({
      salary,
      sessionCost: formula.sessionCost,
      clickCost: formula.clickCost,
    });
  } catch (error) {
    console.error("Salary calculation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
