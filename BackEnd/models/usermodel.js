import mongoose from "mongoose";

const editHistorySchema = new mongoose.Schema(
  {
    editedByUsername: { type: String },
    editedByAvatar: { type: String },
    editedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    shift: { type: String, required: true },
    agentType: { type: String, default: null },
    agentName: { type: String },
    accountTitle: { type: String },
    bankName: { type: String },
    bankNumber: { type: String },
    CreatedBy: { type: String },
    branch: { type: String },
    joiningDate: { type: Date },
    cnic: { type: String },
    userImage: { type: String },
    shiftStartTime: { type: String }, // 🆕 Added
    shiftEndTime: { type: String }, // 🆕 Added
    editHistory: [editHistorySchema],
  },
  {
    timestamps: true,
  }
);

// 🧠 Pre-save hook to set shift times
userSchema.pre("save", function (next) {
  switch (this.shift?.toLowerCase()) {
    case "morning":
      this.shiftStartTime = "08:00 AM";
      this.shiftEndTime = "04:00 PM";
      break;
    case "evening":
      this.shiftStartTime = "04:00 PM";
      this.shiftEndTime = "12:00 AM";
      break;
    case "night":
      this.shiftStartTime = "12:00 AM";
      this.shiftEndTime = "08:00 AM";
      break;
    default:
      this.shiftStartTime = null;
      this.shiftEndTime = null;
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
