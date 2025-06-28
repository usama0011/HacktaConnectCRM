import { Readable } from "stream";
import csv from "csv-parser";
import User from "../models/usermodel.js";
import Attendance from "../models/attendanceModel.js";

export const uploadAttendanceCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const results = [];

    const stream = Readable.from(req.file.buffer);

    stream
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        const attendanceDocs = [];

        for (const row of results) {
          const username = row.username?.trim();

          if (!username) continue;

          const user = await User.findOne({ username });

          if (!user) {
            console.log(`⚠️ User not found: ${username}`);
            continue;
          }

          attendanceDocs.push({
            userId: user._id,
            username: user.username,
            date: row.date ? new Date(row.date) : null,
            status: row.status || "pending",
            checkInTime: row.checkInTime ? new Date(row.checkInTime) : null,
            checkOutTime: row.checkOutTime ? new Date(row.checkOutTime) : null,
            shift: row.shift || null,
            agentType: row.agentType || null,
            branch: row.branch || null,
            updatedBy: row.updatedBy || null,
            editHistory: [], // Optionally populate if desired
          });
        }

        if (attendanceDocs.length > 0) {
          await Attendance.insertMany(attendanceDocs);
          res.json({
            message: "Attendance data uploaded successfully",
            recordsInserted: attendanceDocs.length,
          });
        } else {
          res
            .status(400)
            .json({ message: "No valid records found in CSV" });
        }
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
