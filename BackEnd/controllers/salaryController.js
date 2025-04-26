import User from "../models/usermodel.js";
import IP from "../models/ipmodel.js";
import QCPoint from "../models/qcPointModel.js";
import moment from "moment";

// Salary Formula Settings
const SESSION_RATE = 500; // Rs per session
const CLICK_RATE = 5; // Rs per click
const ABSENT_FINE = 500; // Rs per absent day
const QC_BONUS_THRESHOLD = 80; // QC Points threshold
const QC_BONUS_AMOUNT = 3000; // Rs bonus for QC Points

export const calculateSalaries = async (req, res) => {
  try {
    const { shift, agentType, startDate, endDate } = req.query;

    // Step 1: Fetch Users
    const userQuery = {};
    if (shift) userQuery.shift = shift;
    if (agentType) userQuery.agentType = agentType;

    const users = await User.find(userQuery);

    const start = new Date(startDate);
    const end = new Date(endDate);

    const salaries = await Promise.all(
      users.map(async (user) => {
        // Step 2: Fetch IPs
        const ips = await IP.find({
          userId: user._id,
          date: { $gte: start, $lte: end },
        });

        const totalSessions = ips.reduce(
          (acc, ip) => acc + (ip.sessions || 0),
          0
        );
        const totalClicks = ips.reduce((acc, ip) => acc + (ip.clicks || 0), 0);

        // Step 3: Fetch QC Points
        const qcPointsRecords = await QCPoint.find({
          userId: user._id,
          date: { $gte: start, $lte: end },
        });

        const totalQcPoints = qcPointsRecords.reduce((acc, record) => {
          const values = record;
          const total =
            (values.time === "1" ? 1 : 0) +
            (values.profilePattern === "1" ? 1 : 0) +
            (values.pacePerHour === "1" ? 1 : 0) +
            (values.perHourReport === "1" ? 1 : 0) +
            (values.workingBehavior === "1" ? 1 : 0);
          return acc + total;
        }, 0);

        const qcBonus =
          totalQcPoints >= QC_BONUS_THRESHOLD ? QC_BONUS_AMOUNT : 0;

        // Step 4: Calculate absent days
        const absenties = ips.filter((ip) => ip.status === "Absent").length;
        const absentFine = absenties * ABSENT_FINE;

        // Step 5: Calculate Salary
        const baseSalary =
          totalSessions * SESSION_RATE + totalClicks * CLICK_RATE;
        const bonus = 0; // Assume manual bonus (if needed later)

        const netSalary = baseSalary + qcBonus + bonus - absentFine;

        return {
          key: user._id,
          name: user.username,
          avatar: user.userImage || "",
          bankName: user.bankName || "",
          accountTitle: user.accountTitle || "",
          accountNo: user.bankNumber || "",
          joiningDate: user.joiningDate
            ? moment(user.joiningDate).format("YYYY-MM-DD")
            : "",
          cnic: user.cnic || "",
          sessions: totalSessions,
          clicks: totalClicks,
          totalIps: totalSessions + totalClicks,
          salary: baseSalary,
          absenties,
          absentFine,
          qcPoints: totalQcPoints,
          qcBonus,
          bonus,
          netSalary,
        };
      })
    );

    res.json(salaries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
