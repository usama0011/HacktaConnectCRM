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
      enum: ["pending", "Present", "Absent", "Late", "RotationOff", "Leave"], // Attendance statusa
      default: "pending",
    },
    checkInTime: { type: Date, default: null }, // Stores login timestamp
    checkOutTime: { type: Date, default: null }, // Stores logout timestamp
     // ✅ New Fields
    shift: { type: String, default: null },
    agentType: { type: String, default: null },
    branch: { type: String, default: null },
    updatedBy: { type: String, default: null }, // ✅ NEW: who updated the attendance status
    
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
