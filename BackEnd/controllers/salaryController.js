import IP from "../models/ipmodel.js";
import Salary from "../models/salaryModel.js";
import User from "../models/usermodel.js";

// **Step 1: Save Draft Salary for Review**
export const saveDraftSalary = async (req, res) => {
  try {
    const today = new Date();
    const month = `${today.getFullYear()}-${today.getMonth() + 1}`; // YYYY-MM format

    const users = await User.find();

    for (const user of users) {
      const ipData = await IP.find({ userId: user._id });

      let totalClicks = 0;
      let totalSessions = 0;

      ipData.forEach((entry) => {
        totalClicks += entry.clicks;
        totalSessions += entry.sessions;
      });

      let salary = calculateSalary(totalClicks, totalSessions);

      const existingSalary = await Salary.findOne({ userId: user._id, month });

      if (!existingSalary) {
        const salaryRecord = new Salary({
          userId: user._id,
          username: user.username,
          month,
          totalClicks,
          totalSessions,
          totalSalary: salary,
          status: "Pending", // Allowing admin review before finalizing
        });

        await salaryRecord.save();
      }
    }

    res.json({
      message:
        "Draft salary report saved. Admin can review & edit before finalizing.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Salary draft generation failed",
      error: error.message,
    });
  }
};

// **Step 2: Update Draft Salary (Allow Admin to Modify Data)**
export const updateSalary = async (req, res) => {
  try {
    const { salaryId } = req.params;
    const { totalClicks, totalSessions, totalSalary } = req.body;

    const updatedSalary = await Salary.findByIdAndUpdate(
      salaryId,
      { totalClicks, totalSessions, totalSalary },
      { new: true }
    );

    res.json({ message: "Salary record updated successfully", updatedSalary });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating salary record", error: error.message });
  }
};

// **Step 3: Finalize Salary After Review**
export const finalizeSalary = async (req, res) => {
  try {
    const { month } = req.params;

    await Salary.updateMany(
      { month, status: "Pending" },
      { status: "Finalized" }
    );

    res.json({ message: `Salary for ${month} has been finalized and locked.` });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error finalizing salary", error: error.message });
  }
};

// **Get User Salary History**
export const getUserSalaryHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const salaryRecords = await Salary.find({ userId }).sort({ month: -1 });

    res.json({ success: true, salaryRecords });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// **Salary Calculation Logic**
const calculateSalary = (clicks, sessions) => {
  if (clicks >= 2350 || clicks >= 2000) return 35000;
  if (clicks >= 1500 || sessions >= 2500) return 35000;
  if (clicks >= 1000 && sessions >= 3000) return 35000;
  if (clicks + sessions >= 5000) return 35000;
  if (clicks === 0) return sessions * 6;

  return clicks * 15 + sessions * 6;
};
