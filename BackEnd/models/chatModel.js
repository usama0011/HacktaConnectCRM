import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    avatar: {
      type: String, // URL of user avatar
      default: "", // Optional fallback
    },
    sender: {
      type: String, // You can switch to ObjectId if linking to User model
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
