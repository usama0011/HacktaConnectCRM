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
    editHistory: [editHistorySchema], // 🆕 Added Edit History
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
