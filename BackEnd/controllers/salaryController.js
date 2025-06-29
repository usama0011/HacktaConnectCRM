import User from "../models/usermodel.js";
import IP from "../models/ipmodel.js";
import QCPoint from "../models/qcPointModel.js";
import Attendance from "../models/attendanceModel.js";
import SalaryFormulaOfficeAgents from "../models/OfficeAgentSalaryFormula.js";
import WFHSalaryFormula from "../models/wfhSalaryFormulaModel.js";
import moment from "moment";

export const calculateAgentSalaries = async (req, res) => {
  try {
    const { shift, agentType, startDate,branch, endDate } = req.query;

    const userQuery = {
  role: "agent", // ✅ Only include agents
};
  if (shift) userQuery.shift = shift;
if (agentType) userQuery.agentType = agentType;
if (branch) userQuery.branch = branch; // ✅ Add branch filter
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

    const start = moment(startDate).startOf("day").toDate();
    const end = moment(endDate).endOf("day").toDate();

    const salaryData = await Promise.all(
      users.map(async (user) => {
        const ipData = await IP.aggregate([
          {
            $match: {
              userId: user._id,
              date: { $gte: start, $lte: end },
            },
          },
          {
            $group: {
              _id: null,
              totalClicks: { $sum: "$clicks" },
              totalSessions: { $sum: "$sessions" },
            },
          },
        ]);

        const attendanceData = await Attendance.find({
          userId: user._id,
          date: { $gte: start, $lte: end },
          status: "Absent",
        });

        const absenties = attendanceData.length;

        const qcData = await QCPoint.aggregate([
          {
            $match: {
              userId: user._id,
              date: { $gte: start, $lte: end },
            },
          },
          {
            $group: {
              _id: null,
              avgPoints: { $avg: "$totalPoints" },
            },
          },
        ]);

        const sessions = ipData[0]?.totalSessions || 0;
        const clicks = ipData[0]?.totalClicks || 0;
        const totalIps = sessions + clicks;

        const sessionCost = salaryFormula.sessionCost || 0;
        const clickCost = salaryFormula.clickCost || 0;
        const bonus = salaryFormula.bonus || 0;
        const absentFine = salaryFormula.absentFine || 0;

        let qcBonus = 0;
        let avgPoints = qcData[0]?.avgPoints || 0;

        if (agentType === "Office Agent") {
          if (avgPoints >= 110 && avgPoints <= 119) {
            qcBonus = salaryFormula.qc110_119;
          } else if (avgPoints >= 120 && avgPoints <= 129) {
            qcBonus = salaryFormula.qc120_129;
          } else if (avgPoints >= 130 && avgPoints <= 139) {
            qcBonus = salaryFormula.qc130_139;
          } else if (avgPoints >= 140 && avgPoints <= 149) {
            qcBonus = salaryFormula.qc140_149;
          } else if (avgPoints >= 150) {
            qcBonus = salaryFormula.qc150_plus;
          }
        }

        const calculatedSalary = sessions * sessionCost + clicks * clickCost;
        const totalAbsentFine = absenties * absentFine;
        const netSalary = calculatedSalary - totalAbsentFine + qcBonus + bonus;
        const adjustedSalary =
          calculatedSalary > salaryFormula.maxSalary
            ? salaryFormula.maxSalary
            : calculatedSalary;

        return {
          key: user._id,
          name: user.agentName || user.username,
          avatar: user.userImage,
          bankName: user.bankName,
          accountTitle: user.accountTitle,
          accountNo: user.bankNumber,
          joiningDate: moment(user.joiningDate).format("YYYY-MM-DD"),
          cnic: user.cnic,
          sessions,
          clicks,
          totalIps,
          salary: adjustedSalary, // ✅ Use adjusted salary here for salary column
          absenties,
          absentFine: totalAbsentFine,
          qcPoints: avgPoints,
          qcBonus,
          bonus,
          netSalary,
        };
      })
    );

      // ✅ NEW STEP: Filter only agents with salary > 0
    const filteredData = salaryData.filter((agent) => agent.salary > 0);

    res.status(200).json(filteredData);
  } catch (error) {
    console.error("Error calculating salaries:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getMonthlyBranchSalarySummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const start = moment(`${year}-${month}-01`).startOf("month").toDate();
    const end = moment(`${year}-${month}-01`).endOf("month").toDate();

    const shifts = ["morning", "evening", "night"];
    const branches = ["Branch A", "Branch B", "Main Branch"];
    const agentTypes = ["Office Agent", "WFH Agent"];

    // Fetch latest formulas
    const officeFormula = await SalaryFormulaOfficeAgents.findOne().sort({
      createdAt: -1,
    });
    const wfhFormula = await WFHSalaryFormula.findOne().sort({
      createdAt: -1,
    });

    const summary = [];

    for (const branch of branches) {
      for (const agentType of agentTypes) {
        for (const shift of shifts) {
          // Find users for this combination
          const users = await User.find({
            branch: new RegExp(`^${branch}$`, "i"),
            agentType: new RegExp(`^${agentType}$`, "i"),
            shift: new RegExp(`^${shift}$`, "i"),
            role: { $regex: /^agent$/i },
          });

          let totalSessions = 0;
          let totalClicks = 0;

          if (users.length > 0) {
            const userIds = users.map((u) => u._id);

            // ✅ Bulk aggregate IP data for all users at once
            const ipAgg = await IP.aggregate([
              {
                $match: {
                  userId: { $in: userIds },
                  date: { $gte: start, $lte: end },
                },
              },
              {
                $group: {
                  _id: null,
                  totalClicks: { $sum: "$clicks" },
                  totalSessions: { $sum: "$sessions" },
                },
              },
            ]);

            totalSessions = ipAgg[0]?.totalSessions || 0;
            totalClicks = ipAgg[0]?.totalClicks || 0;
          }

          let sessionCost = 0;
          let clickCost = 0;

          if (agentType === "Office Agent" && officeFormula) {
            sessionCost = officeFormula.sessionCost || 0;
            clickCost = officeFormula.clickCost || 0;
          } else if (agentType === "WFH Agent" && wfhFormula) {
            sessionCost = wfhFormula.sessionCost || 0;
            clickCost = wfhFormula.clickCost || 0;
          }

          const cost = (
            totalSessions * sessionCost +
            totalClicks * clickCost
          ).toFixed(2);

          summary.push({
            branch,
            agentType,
            shift: shift.charAt(0).toUpperCase() + shift.slice(1),
            totalSessions,
            totalClicks,
            totalIPs: totalSessions + totalClicks,
            cost,
          });
        }
      }
    }

    res.status(200).json({ month, year, report: summary });
  } catch (error) {
    console.error("❌ Error generating salary summary report:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
