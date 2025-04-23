import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Skeleton,
  Typography,
  Tag,
  Row,
  Col,
  Avatar,
  Divider,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  EyeOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "../../styles/SingleTaskItem.css";
import ChatBox from "../../components/ChatBox";

const { Title, Paragraph } = Typography;

const SingleTaskItem = () => {
  const { taskId } = useParams();
  console.log(taskId);

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/tasks/${taskId}`
        );
        setTask(res.data);
      } catch (error) {
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  if (loading) return <Skeleton active paragraph={{ rows: 6 }} />;

  return (
    <div className="single-task-container">
      <Card
        className="single-task-card"
        cover={
          <img alt="task" src={task.taskImage} className="single-task-image" />
        }
      >
        <Title level={4}>
          <UserOutlined /> {task.assignee}
        </Title>
        <Tag color="blue">Created by {task.createdBy}</Tag>
        <Divider />

        <Paragraph>
          <ProfileOutlined /> {task.taskSummary}
        </Paragraph>

        <Row gutter={[16, 8]}>
          <Col span={12}>
            <p>
              <CalendarOutlined /> <strong>Start:</strong>{" "}
              {new Date(task.startDate).toLocaleDateString()}
            </p>
          </Col>
          <Col span={12}>
            <p>
              <CalendarOutlined /> <strong>Finish:</strong>{" "}
              {new Date(task.finishDate).toLocaleDateString()}
            </p>
          </Col>
          <Col span={12}>
            <p>
              <CalendarOutlined /> <strong>Deadline:</strong>{" "}
              {new Date(task.deadline).toLocaleDateString()}
            </p>
          </Col>
          <Col span={12}>
            <p>
              <ClockCircleOutlined /> <strong>Duration:</strong> {task.duration}
            </p>
          </Col>
        </Row>

        <Divider />
        <p>
          <TeamOutlined /> <strong>Participants:</strong>{" "}
          {task.participants.join(", ")}
        </p>
        <p>
          <EyeOutlined /> <strong>Observers:</strong>{" "}
          {task.observers.join(", ")}
        </p>
      </Card>
      <ChatBox />
    </div>
  );
};

export default SingleTaskItem;
