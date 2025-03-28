import React from "react";
import { Card, Form, Input, Button, DatePicker, Table, Typography } from "antd";
import {
  UploadOutlined,
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import "../../styles/UploadWork.css";

const { Title, Text } = Typography;

const UploadWork = () => {
  // Sample data for uploaded work table
  const dataSource = [
    {
      key: "1",
      username: "John Doe",
      date: "2024-02-27",
      clicks: 120,
      sessions: 30,
      status: "Approved",
    },
    {
      key: "2",
      username: "Alice Johnson",
      date: "2024-02-26",
      clicks: 85,
      sessions: 25,
      status: "Pending",
    },
    {
      key: "3",
      username: "Michael Smith",
      date: "2024-02-25",
      clicks: 150,
      sessions: 40,
      status: "Rejected",
    },
  ];

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => (
        <span className="uploadwork-username">
          <UserOutlined /> {text}
        </span>
      ),
    },
    {
      title: "Date Submitted",
      dataIndex: "date",
      key: "date",
      render: (text) => (
        <span className="uploadwork-date">
          <CalendarOutlined /> {text}
        </span>
      ),
    },
    {
      title: "Clicks",
      dataIndex: "clicks",
      key: "clicks",
    },
    {
      title: "Sessions",
      dataIndex: "sessions",
      key: "sessions",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <span className={`uploadwork-status ${text.toLowerCase()}`}>
          <CheckCircleOutlined /> {text}
        </span>
      ),
    },
  ];

  return (
    <div className="uploadwork-container">
      <Title level={2} className="uploadwork-title">
        Upload Your Work
      </Title>
      <Text className="uploadwork-subtext">
        Submit your daily work logs and track your progress efficiently.
      </Text>

      {/* Upload Work Form */}
      <Card className="uploadwork-card">
        <Form layout="vertical" className="uploadwork-form">
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your username"
            />
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select the date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Total Clicks"
            name="clicks"
            rules={[{ required: true, message: "Please enter total clicks" }]}
          >
            <Input type="number" placeholder="Enter total clicks" />
          </Form.Item>

          <Form.Item
            label="Total Sessions"
            name="sessions"
            rules={[{ required: true, message: "Please enter total sessions" }]}
          >
            <Input type="number" placeholder="Enter total sessions" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              className="uploadwork-button"
            >
              Submit Work
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Uploaded Work Table */}
      <Card className="uploadwork-table-card">
        <Title level={4} className="uploadwork-table-title">
          Your Performance
        </Title>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default UploadWork;
