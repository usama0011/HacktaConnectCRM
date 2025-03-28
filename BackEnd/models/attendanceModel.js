import mongoose from "mongoose";

// Attendance Schema
const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now }, // Stores the date of login
    status: {
      type: String,
      required: true,
      enum: ["Present", "Absent", "Late", "RotationOff", "Leave"], // Attendance status
      default: "Present",
    },
    checkInTime: { type: Date, default: null }, // Stores login timestamp
    checkOutTime: { type: Date, default: null }, // Stores logout timestamp
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
