import React, { useEffect, useState } from "react";
import {
  Card,
  Skeleton,
  Switch,
  List,
  Typography,
  Row,
  Col,
  Tag,
  Avatar,
  Button,
  Tooltip,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  EyeOutlined,
  ProfileOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/ViewUserTaskCreations.css";
import ProjectInfoCard from "../../components/ProjectInfoCard";

const { Title, Paragraph } = Typography;

const ViewUserTaskCreations = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGrid, setIsGrid] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tasks/all");
        setTasks(res.data || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="task-view-container">
      <ProjectInfoCard
        titleproject="View All Tasks"
        projectdes="A modern dashboard to browse and review assigned tasks. Toggle between card or list view."
      />

      <div className="task-header-row">
        <div className="left" style={{ color: "white" }}>
          {isGrid ? "Grid View" : "List View"}
        </div>
        <div className="center">
          <div className="custom-view-toggle">
            <img
              src="https://img.icons8.com/?size=50&id=774&format=png"
              alt="List View"
              className={`view-icon ${!isGrid ? "active" : ""}`}
              onClick={() => setIsGrid(false)}
            />
            <img
              src="https://img.icons8.com/?size=50&id=11393&format=png"
              alt="Grid View"
              className={`view-icon ${isGrid ? "active" : ""}`}
              onClick={() => setIsGrid(true)}
            />
          </div>
        </div>
        <div className="right">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/dashboard/newTask")}
          >
            Add New Task
          </Button>
        </div>
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : isGrid ? (
        <Row gutter={[16, 16]} className="grid-layout">
          {tasks.map((task) => (
            <Col xs={24} sm={12} md={8} lg={6} key={task._id}>
              <Card className="task-card-grid" hoverable>
                <div className="taskimagecontainer">
                  <img
                    alt="task"
                    src={task.taskImage}
                    className="task-image-cover"
                  />
                </div>
                <Title level={5}>
                  <UserOutlined /> {task.assignee}
                </Title>
                <Tag color="purple">Created By: {task.createdBy}</Tag>
                <Paragraph className="summary">
                  <ProfileOutlined />
                  <Tooltip title={task.taskSummary}>
                    <span>
                      {task.taskSummary.length > 100
                        ? `${task.taskSummary.slice(0, 100)}...`
                        : task.taskSummary}
                    </span>
                  </Tooltip>
                </Paragraph>
                <p>
                  <CalendarOutlined /> <strong>Start:</strong>{" "}
                  {new Date(task.startDate).toLocaleDateString()}
                </p>
                <p>
                  <CalendarOutlined /> <strong>Deadline:</strong>{" "}
                  {new Date(task.deadline).toLocaleDateString()}
                </p>
                <p>
                  <ClockCircleOutlined /> <strong>Duration:</strong>{" "}
                  {task.duration}
                </p>
                <p>
                  <TeamOutlined /> <strong>Participants:</strong>{" "}
                  {task.participants.join(", ")}
                </p>
                <p>
                  <EyeOutlined /> <strong>Observers:</strong>{" "}
                  {task.observers.join(", ")}
                </p>
                <Button
                  type="link"
                  className="viewdtailbuttontsk"
                  onClick={() =>
                    navigate(`/admin/dashboard/singletask/${task._id}`)
                  }
                >
                  View Details
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={tasks}
          className="task-list"
          renderItem={(task) => (
            <List.Item key={task._id}>
              <Card className="task-card-list">
                <Row gutter={16}>
                  <Col flex="100px">
                    <Avatar shape="square" size={80} src={task.taskImage} />
                  </Col>
                  <Col flex="auto">
                    <Title level={5}>
                      <UserOutlined /> {task.assignee}
                    </Title>
                    <Tag color="blue">Created by {task.createdBy}</Tag>
                    <p>
                      <ProfileOutlined /> {task.taskSummary}
                    </p>
                    <p>
                      <CalendarOutlined /> <strong>Start:</strong>{" "}
                      {new Date(task.startDate).toLocaleDateString()}
                    </p>
                    <p>
                      <CalendarOutlined /> <strong>Deadline:</strong>{" "}
                      {new Date(task.deadline).toLocaleDateString()}
                    </p>
                    <p>
                      <ClockCircleOutlined /> <strong>Duration:</strong>{" "}
                      {task.duration}
                    </p>
                    <p>
                      <TeamOutlined /> <strong>Participants:</strong>{" "}
                      {task.participants.join(", ")}
                    </p>
                    <p>
                      <EyeOutlined /> <strong>Observers:</strong>{" "}
                      {task.observers.join(", ")}
                    </p>
                    <Button
                      type="link"
                      onClick={() =>
                        navigate(`/admin/dashboard/viewtask/${task._id}`)
                      }
                    >
                      View Details
                    </Button>
                  </Col>
                </Row>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default ViewUserTaskCreations;
