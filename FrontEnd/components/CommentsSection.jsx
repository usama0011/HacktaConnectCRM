import React, { useState } from "react";
import { List, Avatar, Button, Input, Typography } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import moment from "moment";
import { Comment } from "@ant-design/compatible";

const { TextArea } = Input;
const { Text } = Typography;

const CommentsSection = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "John Doe",
      content: "Great job on this!",
      avatar: "https://i.pravatar.cc/40?u=johndoe",
      timestamp: moment().format("hh:mm A, MM/DD/YYYY"),
      likes: 0,
      dislikes: 0,
      replies: [],
    },
    {
      id: 2,
      author: "Jane Smith",
      content: "Can we extend the deadline?",
      avatar: "https://i.pravatar.cc/40?u=janesmith",
      timestamp: moment().format("hh:mm A, MM/DD/YYYY"),
      likes: 0,
      dislikes: 0,
      replies: [],
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Handle Like and Dislike
  const handleLike = (id, isReply = false, parentId = null) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === id ? { ...reply, likes: reply.likes + 1 } : reply
            ),
          };
        }
        return comment.id === id
          ? { ...comment, likes: comment.likes + 1 }
          : comment;
      })
    );
  };

  const handleDislike = (id, isReply = false, parentId = null) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === id
                ? { ...reply, dislikes: reply.dislikes + 1 }
                : reply
            ),
          };
        }
        return comment.id === id
          ? { ...comment, dislikes: comment.dislikes + 1 }
          : comment;
      })
    );
  };

  // Add New Comment
  const addComment = () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          author: "Current User",
          content: newComment,
          avatar: "https://i.pravatar.cc/40?u=currentuser",
          timestamp: moment().format("hh:mm A, MM/DD/YYYY"),
          likes: 0,
          dislikes: 0,
          replies: [],
        },
      ]);
      setNewComment("");
      setSubmitting(false);
    }, 1000);
  };

  // Add Reply to a Comment or Reply
  const addReply = (parentId, replyToId = null) => {
    if (!replyText[parentId]?.trim()) return;

    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              {
                id: comment.replies.length + 1,
                author: "Current User",
                content: replyText[parentId],
                avatar: "https://i.pravatar.cc/40?u=currentuser",
                timestamp: moment().format("hh:mm A, MM/DD/YYYY"),
                likes: 0,
                dislikes: 0,
                replies: [],
              },
            ],
          };
        }
        return comment;
      })
    );

    setReplyText({ ...replyText, [parentId]: "" });
  };

  return (
    <div>
      {/* Input for New Comment */}
      <div className="comment-input">
        <Avatar src="https://i.pravatar.cc/40?u=currentuser" />
        <TextArea
          rows={2}
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button type="primary" onClick={addComment} loading={submitting}>
          Comment
        </Button>
      </div>

      {/* List of Comments */}
      <List
        className="comments-list"
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={(item) => (
          <Comment
            author={item.author}
            avatar={item.avatar}
            content={
              <>
                <p>{item.content}</p>
                <Text type="secondary">{item.timestamp}</Text>
              </>
            }
            actions={[
              <span onClick={() => handleLike(item.id)} key="like">
                <LikeOutlined /> {item.likes}
              </span>,
              <span onClick={() => handleDislike(item.id)} key="dislike">
                <DislikeOutlined /> {item.dislikes}
              </span>,
              <Button
                type="link"
                onClick={() => setReplyText({ ...replyText, [item.id]: "" })}
              >
                Reply
              </Button>,
            ]}
          >
            {/* Reply Input */}
            {replyText[item.id] !== undefined && (
              <div className="reply-input">
                <TextArea
                  rows={1}
                  placeholder="Reply..."
                  value={replyText[item.id]}
                  onChange={(e) =>
                    setReplyText({ ...replyText, [item.id]: e.target.value })
                  }
                />
                <Button
                  type="primary"
                  onClick={() => addReply(item.id)}
                  size="small"
                >
                  Reply
                </Button>
              </div>
            )}

            {/* Render Nested Replies */}
            <List
              dataSource={item.replies}
              renderItem={(reply) => (
                <Comment
                  author={reply.author}
                  avatar={reply.avatar}
                  content={
                    <>
                      <p>{reply.content}</p>
                      <Text type="secondary">{reply.timestamp}</Text>
                    </>
                  }
                  actions={[
                    <span
                      onClick={() => handleLike(reply.id, true, item.id)}
                      key="like"
                    >
                      <LikeOutlined /> {reply.likes}
                    </span>,
                    <span
                      onClick={() => handleDislike(reply.id, true, item.id)}
                      key="dislike"
                    >
                      <DislikeOutlined /> {reply.dislikes}
                    </span>,
                    <Button
                      type="link"
                      onClick={() =>
                        setReplyText({ ...replyText, [reply.id]: "" })
                      }
                    >
                      Reply
                    </Button>,
                  ]}
                >
                  {/* Reply Input for Nested Replies */}
                  {replyText[reply.id] !== undefined && (
                    <div className="reply-input">
                      <TextArea
                        rows={1}
                        placeholder="Reply..."
                        value={replyText[reply.id]}
                        onChange={(e) =>
                          setReplyText({
                            ...replyText,
                            [reply.id]: e.target.value,
                          })
                        }
                      />
                      <Button
                        type="primary"
                        onClick={() => addReply(item.id, reply.id)}
                        size="small"
                      >
                        Reply
                      </Button>
                    </div>
                  )}
                </Comment>
              )}
            />
          </Comment>
        )}
      />
    </div>
  );
};

export default CommentsSection;
