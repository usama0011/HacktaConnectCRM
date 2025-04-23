import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  action: String,
  by: String,
  timestamp: String,
});

const qcPointSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  avatar: String,
  name: String,
  time: String,
  profilePattern: String,
  pacePerHour: String,
  perHourReport: String,
  workingBehavior: String,
  totalPoints: Number,
  editedBy: String,
  history: [historySchema],
});

const QCPoint = mongoose.model("QCPoint", qcPointSchema);
export default QCPoint;
