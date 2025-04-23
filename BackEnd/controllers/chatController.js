import Chat from "../models/chatModel.js";

// Create a new message
export const addMessage = async (req, res) => {
  const { taskId, sender, message, avatar } = req.body;
  try {
    const newMessage = new Chat({ taskId, avatar, sender, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add message", error: err.message });
  }
};

// Get all messages for a task
export const getMessages = async (req, res) => {
  const { taskId } = req.params;
  try {
    const messages = await Chat.find({ taskId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch messages", error: err.message });
  }
};
