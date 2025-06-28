import { Readable } from "stream";
import csv from "csv-parser";
import User from "../models/usermodel.js";
import QCPoint from "../models/qcPointModel.js";

export const uploadQCPointsCSV = async (req, res) => {
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
        const qcDocs = [];

        for (const row of results) {
          const username = row.name?.trim();

          if (!username) continue;

          const user = await User.findOne({ username });

          if (!user) {
            console.log(`⚠️ User not found: ${username}`);
            continue;
          }

          const time = Number(row.time || 0);
          const profilePattern = Number(row.profilePattern || 0);
          const pacePerHour = Number(row.pacePerHour || 0);
          const perHourReport = Number(row.perHourReport || 0);
          const workingBehavior = Number(row.workingBehavior || 0);

          const totalPoints =
            time +
            profilePattern +
            pacePerHour +
            perHourReport +
            workingBehavior;

          qcDocs.push({
            userId: user._id,
            date: row.date ? new Date(row.date) : null,
            avatar: user.userImage,
            name: row.name || null,
            time: row.time || null,
            profilePattern: row.profilePattern || null,
            pacePerHour: row.pacePerHour || null,
            perHourReport: row.perHourReport || null,
            workingBehavior: row.workingBehavior || null,
            totalPoints,
            editedBy: row.editedBy || null,
            shift: row.shift || null,
            agentType: row.agentType || null,
            branch: row.branch || null,
            history: [],
          });
        }

        if (qcDocs.length > 0) {
          await QCPoint.insertMany(qcDocs);
          res.json({
            message: "QCPoints data uploaded successfully",
            recordsInserted: qcDocs.length,
          });
        } else {
          res.status(400).json({ message: "No valid records found in CSV" });
        }
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
