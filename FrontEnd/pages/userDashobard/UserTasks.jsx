import React, { useState } from "react";
import { Table, Avatar, Badge, Button, Typography, Space, Tooltip } from "antd";
import {
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../../styles/UserTasks.css";

const { Title, Text } = Typography;

const UserTasks = () => {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(null);

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

  const handleTaskClick = (task) => {
    navigate(`/user/dashboard/tasks/${task.key}`, { state: { task } });
  };

  const columns = [
    {
      title: (
        <span>
          <FileTextOutlined /> Task Name
        </span>
      ),
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Button
          type="link"
          className="task-link-btn"
          onClick={() => handleTaskClick(record)}
        >
          {text}
        </Button>
      ),
    },
    {
      title: (
        <span>
          <CalendarOutlined /> Active
        </span>
      ),
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => (
        <Text>
          <CalendarOutlined style={{ marginRight: 6 }} />
          {date}
        </Text>
      ),
    },
    {
      title: (
        <span>
          <CheckCircleOutlined /> Deadline
        </span>
      ),
      dataIndex: "status",
      key: "status",
      render: () => <Badge status="default" text="No Deadline" />,
    },
    {
      title: (
        <span>
          <UserOutlined /> Created By
        </span>
      ),
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
        All Tasks
      </Title>
      <Text className="user-tasks-subtext">
        View and manage your assigned tasks with ease.
      </Text>

      <Table
        className="user-tasks-table"
        columns={columns}
        dataSource={tasks}
        pagination={{ pageSize: 5 }}
        rowSelection={{ type: "checkbox" }}
        bordered
      />
    </div>
  );
};

export default UserTasks;
