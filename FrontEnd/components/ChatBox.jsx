import React, { useEffect, useState } from "react";
import { Input, Button, List, Typography, Avatar } from "antd";
import { SendOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useUserContext } from "../context/UserContext"; // ✅ Import context
import dayjs from "dayjs"; // Add this line
import "../styles/ChatBox.css";

const { Text } = Typography;

const ChatBox = () => {
  const { user } = useUserContext(); // ✅ Get current user
  const { taskId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/chat/${taskId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [taskId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    await axios.post("http://localhost:5000/api/chat/send", {
      taskId,
      sender: user?.username || "Anonymous", // ✅ Use context user
      message: input,
      avatar: user?.userImage || "", // ✅ Pass avatar
    });

    setInput("");
    fetchMessages();
  };

  return (
    <div className="chat-box">
      <div className="chat-header">
        <Text strong className="chat-title">
          Comments ({messages.length})
        </Text>
      </div>
      <br />
      <List
        size="small"
        bordered
        className="chat-messages"
        dataSource={messages}
        renderItem={(item) => (
          <List.Item className="chat-message-item">
            <Avatar src={item.avatar} icon={<UserOutlined />} size="large" />
            <div className="chat-content">
              <Text style={{ textTransform: "capitalize" }} strong>
                {item.sender}
              </Text>
              <Text>{item.message}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {dayjs(item.createdAt).format("MMM D, YYYY h:mm A  ")}
              </Text>
            </div>
          </List.Item>
        )}
      />
      <Input.Group compact style={{ marginTop: 10 }}>
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: "calc(100% - 50px)" }}
        />
        <Button type="primary" icon={<SendOutlined />} onClick={handleSend} />
      </Input.Group>
    </div>
  );
};

export default ChatBox;
