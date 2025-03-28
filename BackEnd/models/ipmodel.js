import mongoose from "mongoose";

// IP Submission Schema
const ipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now }, // Stores the date of submission
    clicks: { type: Number, default: 0 }, // Total clicks submitted
    sessions: { type: Number, default: 0 }, // Total sessions submitted
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const IP = mongoose.model("DayCount", ipSchema);

export default IP;
