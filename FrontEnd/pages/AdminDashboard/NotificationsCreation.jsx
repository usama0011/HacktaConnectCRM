import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  message,
  Table,
  Tag,
} from "antd";
import {
  NotificationOutlined,
  CalendarOutlined,
  FileTextOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "../../styles/NotificationsCreation.css";

const { Option } = Select;
const { TextArea } = Input;

const NotificationsCreation = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      key: "1",
      title: "System Update",
      audience: "All Employees",
      date: "March 20, 2024",
      status: "Sent",
    },
    {
      key: "2",
      title: "HR Meeting",
      audience: "HR Department",
      date: "March 22, 2024",
      status: "Scheduled",
    },
    {
      key: "3",
      title: "Security Alert",
      audience: "Developers",
      date: "March 18, 2024",
      status: "Sent",
    },
  ]);

  const handleSubmit = (values) => {
    setLoading(true);
    setTimeout(() => {
      const newNotification = {
        key: (notifications.length + 1).toString(),
        title: values.title,
        audience: values.audience,
        date: values.date.format("MMMM DD, YYYY"),
        status: "Scheduled",
      };
      setNotifications([...notifications, newNotification]);
      message.success(`Notification "${values.title}" has been scheduled.`);
      form.resetFields();
      setLoading(false);
    }, 1500);
  };

  // Table Columns
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Audience",
      dataIndex: "audience",
      key: "audience",
      render: (audience) => <Tag color="blue">{audience}</Tag>,
    },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Sent" ? "green" : "gold"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: () => (
        <Button type="primary" size="small">
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="notifications-container">
      <h2 className="notifications-title">
        <NotificationOutlined /> Notifications Management
      </h2>

      <Card className="notifications-card">
        <h3 className="notifications-subtitle">
          <FileTextOutlined /> Create New Notification
        </h3>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="notifications-form"
        >
          {/* Notification Title */}
          <Form.Item
            name="title"
            label="Notification Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input
              prefix={<FileTextOutlined />}
              placeholder="Enter notification title"
            />
          </Form.Item>

          {/* Audience Selection */}
          <Form.Item
            name="audience"
            label="Target Audience"
            rules={[{ required: true, message: "Select an audience" }]}
          >
            <Select placeholder="Select audience">
              <Option value="all">All Employees</Option>
              <Option value="agents">Agents Only</Option>
              <Option value="users">Users Only</Option>
              <Option value="managers">Managers</Option>
            </Select>
          </Form.Item>

          {/* Notification Date */}
          <Form.Item
            name="date"
            label="Notification Date"
            rules={[{ required: true, message: "Select a date" }]}
          >
            <DatePicker
              className="notifications-date"
              prefix={<CalendarOutlined />}
            />
          </Form.Item>

          {/* Notification Content */}
          <Form.Item
            name="content"
            label="Notification Content"
            rules={[{ required: true, message: "Enter notification details" }]}
          >
            <TextArea rows={4} placeholder="Enter notification details..." />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="notifications-submit-button"
            >
              <PlusOutlined /> Send Notification
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <br />

      {/* Notifications Table */}
      <Card className="notifications-card">
        <h3 className="notifications-subtitle">
          <FileTextOutlined /> Sent Notifications
        </h3>
        <Table
          columns={columns}
          dataSource={notifications}
          pagination={{ pageSize: 4 }}
        />
      </Card>
    </div>
  );
};

export default NotificationsCreation;
