import React, { useState, useEffect } from "react";
import {
  Table,
  Avatar,
  Badge,
  Button,
  Typography,
  Space,
  Tooltip,
  Spin,
} from "antd";
import {
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../../context/UserContext";
import "../../styles/UserTasks.css";

const { Title, Text } = Typography;

const UserTasks = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserTasks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/tasks/user/${user.username}`
      );
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch user tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.username) {
      fetchUserTasks();
    }
  }, [user]);

  const handleTaskClick = (task) => {
    navigate(`/user/dashboard/tasks/${task._id}`, { state: { task } });
  };

  const columns = [
    {
      title: (
        <span>
          <FileTextOutlined /> Task Name
        </span>
      ),
      dataIndex: "taskSummary",
      key: "taskSummary",
      render: (text, record) => (
        <Button
          type="link"
          className="task-link-btn"
          onClick={() => handleTaskClick(record)}
        >
          {text || "Untitled Task"}
        </Button>
      ),
    },
    {
      title: (
        <span>
          <CalendarOutlined /> Start Date
        </span>
      ),
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => (
        <Text>
          <CalendarOutlined style={{ marginRight: 6 }} />
          {date ? new Date(date).toLocaleDateString("en-GB") : "—"}
        </Text>
      ),
    },
    {
      title: (
        <span>
          <CheckCircleOutlined /> Deadline
        </span>
      ),
      dataIndex: "deadline",
      key: "deadline",
      render: (date) =>
        date ? (
          <Badge
            status="processing"
            text={new Date(date).toLocaleDateString("en-GB")}
          />
        ) : (
          <Badge status="default" text="No Deadline" />
        ),
    },
    {
      title: (
        <span>
          <UserOutlined /> Created By
        </span>
      ),
      dataIndex: "createdBy",
      key: "createdBy",
      render: (user) => (
        <Space>
          <Avatar src="https://i.pravatar.cc/40?u=createdby" />
          <Text>{user}</Text>
        </Space>
      ),
    },
    {
      title: (
        <span>
          <UserOutlined /> Assignee
        </span>
      ),
      dataIndex: "assignee",
      key: "assignee",
      render: (user) => (
        <Space>
          <Avatar src="https://i.pravatar.cc/40?u=assignee" />
          <Text>{user}</Text>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-tasks-container">
      <Title level={2} className="user-tasks-title">
        My Assigned Tasks
      </Title>
      <Text className="user-tasks-subtext">
        View and manage your assigned or participant tasks.
      </Text>

      {loading ? (
        <Spin tip="Loading tasks..." size="large" />
      ) : (
        <Table
          className="user-tasks-table"
          columns={columns}
          dataSource={tasks.map((task) => ({ ...task, key: task._id }))}
          pagination={{ pageSize: 5 }}
          rowSelection={{ type: "checkbox" }}
          bordered
        />
      )}
    </div>
  );
};

export default UserTasks;
