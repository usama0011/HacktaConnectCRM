import React, { useState } from "react";
import { Card, Typography, Avatar, Button, Input, List, Badge } from "antd";
import {
  CheckCircleOutlined,
  LikeOutlined,
  DislikeOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Comment } from "@ant-design/compatible"; // ✅ Proper Import
import { useLocation } from "react-router-dom";
import "../../styles/ViewSingleTask.css";
import moment from "moment";

const { Title, Text } = Typography;
const { TextArea } = Input;

const ViewSingleTask = () => {
  const location = useLocation();
  const task = location.state?.task || {
    title: "Untitled Task",
    status: "Pending",
    assignedBy: "Unknown",
    assignee: "Unknown",
    participants: [],
    observers: [],
  };

  // Comment State
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "John Doe",
      content: "Great job on this!",
      avatar: "https://i.pravatar.cc/40?u=johndoe",
      replies: [],
    },
    {
      id: 2,
      author: "Jane Smith",
      content: "Can we extend the deadline?",
      avatar: "https://i.pravatar.cc/40?u=janesmith",
      replies: [],
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Add New Comment
  const addComment = () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      const newEntry = {
        id: comments.length + 1,
        author: "Current User",
        content: newComment,
        avatar: "https://i.pravatar.cc/40?u=currentuser",
        replies: [],
      };
      setComments([...comments, newEntry]);
      setNewComment("");
      setSubmitting(false);
    }, 1000);
  };

  // Add Reply to a Comment
  const addReply = (parentId) => {
    if (!replyText[parentId]?.trim()) return;

    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === parentId
          ? {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  id: comment.replies.length + 1,
                  author: "Current User",
                  content: replyText[parentId],
                  avatar: "https://i.pravatar.cc/40?u=currentuser",
                },
              ],
            }
          : comment
      )
    );

    setReplyText({ ...replyText, [parentId]: "" });
  };

  return (
    <div className="task-container">
      {/* Task Card */}
      <Card className="task-card">
        <div className="task-header">
          <Title level={3} className="task-title">
            {task.title}{" "}
            <Badge
              status={
                task.status === "Pending"
                  ? "warning"
                  : task.status === "Completed"
                  ? "success"
                  : "default"
              }
              text={task.status}
            />
          </Title>
        </div>

        {/* Task Details */}
        <div className="task-details">
          <Text strong>
            <UserOutlined style={{ marginRight: 8 }} />
            Created By:
          </Text>
          <div className="user-info">
            <Avatar src="https://i.pravatar.cc/40?u=createdby" />
            <Text>{task.assignedBy}</Text>
          </div>

          <Text strong>
            <CheckCircleOutlined style={{ marginRight: 8 }} />
            Assignee:
          </Text>
          <div className="user-info">
            <Avatar src="https://i.pravatar.cc/40?u=assignee" />
            <Text>{task.assignee}</Text>
          </div>

          <Text strong>
            <UserOutlined style={{ marginRight: 8 }} />
            Participants:
          </Text>
          <div className="user-info">
            {task.participants?.length > 0 ? (
              task.participants.map((user, index) => (
                <Avatar
                  key={index}
                  src={`https://i.pravatar.cc/40?u=${user}`}
                />
              ))
            ) : (
              <Text>No Participants</Text>
            )}
          </div>

          <Text strong>
            <FileTextOutlined style={{ marginRight: 8 }} />
            Task Summary:
          </Text>
          <Card className="task-summary-card">
            <Text>
              {task.description ||
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur necessitatibus earum assumenda praesentium dignissimos, officia tenetur quae magni quas quos ipsum labore iusto, libero, minima non ipsa quo sequi deserunt."}
            </Text>
          </Card>

          <Text strong>
            <UserOutlined style={{ marginRight: 8 }} />
            Observers:
          </Text>
          <div className="user-info">
            {task.observers?.length > 0 ? (
              task.observers.map((user, index) => (
                <Avatar
                  key={index}
                  src={`https://i.pravatar.cc/40?u=${user}`}
                />
              ))
            ) : (
              <Text>No Observers</Text>
            )}
          </div>
        </div>

        {/* Finish Task Button */}
        <div className="task-actions">
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            className="finish-task-btn"
          >
            Finish
          </Button>
        </div>
      </Card>

      {/* Comments Section */}
      <Card className="comments-card">
        <Title level={4} className="comments-title">
          Comments
        </Title>
        {/* Input for New Comment */}
        <div className="comment-input">
          <Avatar src="https://i.pravatar.cc/40?u=currentuser" />
          <TextArea
            rows={2}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            type="primary"
            onClick={addComment}
            loading={submitting}
            className="add-comment-btn"
          >
            Comment
          </Button>
        </div>
        {/* List of Comments */}
      </Card>
    </div>
  );
};

export default ViewSingleTask;
