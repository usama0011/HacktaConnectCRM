import { Readable } from "stream";
import csv from "csv-parser";
import User from "../models/usermodel.js";
import IP from "../models/ipmodel.js";

export const uploadIPCSV = async (req, res) => {
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
        const ipDocs = [];

        for (const row of results) {
          const username = row.username?.trim();

          if (!username) continue;

          const user = await User.findOne({ username });

          if (!user) {
            console.log(`⚠️ User not found: ${username}`);
            continue;
          }

          ipDocs.push({
            userId: user._id,
            username: user.username,
            date: row.date ? new Date(row.date) : null,
            clicks: row.clicks ? Number(row.clicks) : null,
            sessions: row.sessions ? Number(row.sessions) : null,
            status: row.status || null,
            shift: row.shift || null,
            agentType: row.agentType || null,
            branch: row.branch || null,
          });
        }

        if (ipDocs.length > 0) {
          await IP.insertMany(ipDocs);
          res.json({
            message: "IP data uploaded successfully",
            recordsInserted: ipDocs.length,
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
