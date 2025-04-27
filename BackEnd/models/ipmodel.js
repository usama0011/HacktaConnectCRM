import mongoose from "mongoose";

// History Schema
const editHistorySchema = new mongoose.Schema({
  editor: { type: String }, // who edited
  timestamp: { type: String }, // readable timestamp
  sessions: { type: Number },
  clicks: { type: Number },
  isOriginal: { type: Boolean, default: false },
});

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
    status: { type: String, required: true },
    avatar: { type: String, default: "" }, // ✅ New field to store user image
    history: [editHistorySchema], // ✅ New array to store edit history
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const IP = mongoose.model("DayCount", ipSchema);

export default IP;
