// controllers/salaryDownloadController.js
import User from "../models/usermodel.js";
import IP from "../models/ipmodel.js";
import QCPoint from "../models/qcPointModel.js";
import Attendance from "../models/attendanceModel.js";
import SalaryFormulaOfficeAgents from "../models/OfficeAgentSalaryFormula.js";
import WFHSalaryFormula from "../models/wfhSalaryFormulaModel.js";
import moment from "moment";

export const downloadSalarySheet = async (req, res) => {
  try {
const { shift, agentType, year, month, branch, hasBankAccount } = req.query;

    if (!shift || !agentType || !year || !month) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const start = moment(`${year}-${month}-01`).startOf("month").toDate();
    const end = moment(`${year}-${month}-01`).endOf("month").toDate();

 // ✅ Build user query dynamically
let userQuery = {
  shift,
  agentType,
};

if (branch) userQuery.branch = branch;
if (hasBankAccount === "true") userQuery.bankaccountstatus = true;
else if (hasBankAccount === "false") userQuery.bankaccountstatus = false;

const users = await User.find(userQuery);
    let salaryFormula = null;
    if (agentType === "Office Agent") {
      salaryFormula = await SalaryFormulaOfficeAgents.findOne().sort({
        createdAt: -1,
      });
    } else if (agentType === "WFH Agent") {
      salaryFormula = await WFHSalaryFormula.findOne().sort({ createdAt: -1 });
    }

    if (!salaryFormula) {
      return res.status(400).json({ message: "Salary formula not found" });
    }

    const result = await Promise.all(
      users.map(async (user, index) => {
        const ipData = await IP.aggregate([
          { $match: { userId: user._id, date: { $gte: start, $lte: end } } },
          {
            $group: {
              _id: null,
              totalSessions: { $sum: "$sessions" },
              totalClicks: { $sum: "$clicks" },
            },
          },
        ]);

        const attendanceData = await Attendance.find({
          userId: user._id,
          date: { $gte: start, $lte: end },
          status: "Absent",
        });

        const absenties = attendanceData.length;

        const sessions = ipData[0]?.totalSessions || 0;
        const clicks = ipData[0]?.totalClicks || 0;

        const calculatedSalary =
          sessions * (salaryFormula.sessionCost || 0) +
          clicks * (salaryFormula.clickCost || 0);

        const adjustedSalary =
          agentType === "Office Agent" && salaryFormula.maxSalary
            ? Math.min(calculatedSalary, salaryFormula.maxSalary)
            : calculatedSalary;

        const totalAbsentFine = absenties * (salaryFormula.absentFine || 0);

        let qcBonus = 0;
        if (agentType === "Office Agent") {
          const qcData = await QCPoint.aggregate([
            { $match: { userId: user._id, date: { $gte: start, $lte: end } } },
            { $group: { _id: null, avgPoints: { $avg: "$totalPoints" } } },
          ]);

          const avgPoints = qcData[0]?.avgPoints || 0;

          if (avgPoints >= 110 && avgPoints <= 119)
            qcBonus = salaryFormula.qc110_119;
          else if (avgPoints >= 120 && avgPoints <= 129)
            qcBonus = salaryFormula.qc120_129;
          else if (avgPoints >= 130 && avgPoints <= 139)
            qcBonus = salaryFormula.qc130_139;
          else if (avgPoints >= 140 && avgPoints <= 149)
            qcBonus = salaryFormula.qc140_149;
          else if (avgPoints >= 150) qcBonus = salaryFormula.qc150_plus;
        }

        const finalNetSalary =
          adjustedSalary -
          totalAbsentFine +
          qcBonus +
          (salaryFormula.bonus || 0);

        return {
          srNo: index + 1,
          bank: user.bankName || "Unknown Bank",
          accountTitle: user.accountTitle || user.username,
          accountNumber: user.bankNumber || "N/A",
          salary: Math.round(finalNetSalary),
        };
      })
    );

   const filteredResult = result.filter(entry => entry.salary > 0);
res.status(200).json(filteredResult);

  } catch (error) {
    console.error("Download Salary Sheet Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
