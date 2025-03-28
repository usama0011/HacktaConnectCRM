import React, { useState } from "react";
import {
  Table,
  Avatar,
  Badge,
  Button,
  Typography,
  Space,
  Dropdown,
  Menu,
} from "antd";
import {
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../../styles/UserTasks.css";

const { Title, Text } = Typography;

const UserTasks = () => {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(null);

  // Dummy Task Data (Fetched from Admin Assigned Tasks)
  const tasks = [
    {
      key: "1",
      title: "Salary",
      dueDate: "March 15, 1:19 PM",
      status: "No Deadline",
      assignedBy: "Abdul Moiz",
      assignee: "Abdul Moiz",
    },
    {
      key: "2",
      title: "Hackta Bahia Morning Salary",
      dueDate: "February 27, 10:28 AM",
      status: "No Deadline",
      assignedBy: "Abdul Moiz",
      assignee: "Abdul Moiz",
    },
  ];

  // Handle Task Click - Navigate to Task Details Page
  const handleTaskClick = (task) => {
    navigate(`/user/dashboard/tasks/${task.key}`, { state: { task } });
  };

  // Define Table Columns
  const columns = [
    {
      title: "Task Name",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Button type="link" onClick={() => handleTaskClick(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: "Active",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => (
        <>
          <CalendarOutlined style={{ marginRight: 5 }} />
          {date}
        </>
      ),
    },
    {
      title: "Deadline",
      dataIndex: "status",
      key: "status",
      render: () => <Badge status="default" text="No deadline" />,
    },
    {
      title: "Created By",
      dataIndex: "assignedBy",
      key: "assignedBy",
      render: (user) => (
        <Space>
          <Avatar src="https://i.pravatar.cc/40?u=createdby" />
          <Text>{user}</Text>
        </Space>
      ),
    },
    {
      title: "Assignee",
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
        All Tasks
      </Title>
      <Text className="user-tasks-subtext">
        View and manage your assigned tasks.
      </Text>

      <Table
        columns={columns}
        dataSource={tasks}
        pagination={{ pageSize: 10 }}
        rowSelection={{ type: "checkbox" }}
      />
    </div>
  );
};

export default UserTasks;
