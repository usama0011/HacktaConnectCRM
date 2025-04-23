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
  ClockCircleOutlined,
} from "@ant-design/icons";
import "../../styles/Announcements.css";

const { Option } = Select;
const { TextArea } = Input;

const Announcements = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Dummy Announcements Data
  const [announcements, setAnnouncements] = useState([
    {
      key: "1",
      title: "Company Meeting",
      audience: "All Employees",
      date: "March 25, 2024",
      status: "Scheduled",
    },
    {
      key: "2",
      title: "Security Update",
      audience: "IT Department",
      date: "March 20, 2024",
      status: "Published",
    },
    {
      key: "3",
      title: "Project Deadline Reminder",
      audience: "Developers",
      date: "March 18, 2024",
      status: "Scheduled",
    },
  ]);

  const handleSubmit = (values) => {
    setLoading(true);
    setTimeout(() => {
      const newAnnouncement = {
        key: (announcements.length + 1).toString(),
        title: values.title,
        audience: values.audience,
        date: values.date.format("MMMM DD, YYYY"),
        status: "Scheduled",
      };
      setAnnouncements([...announcements, newAnnouncement]);
      message.success(
        `Announcement "${values.title}" has been created successfully!`
      );
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
        <Tag color={status === "Published" ? "green" : "gold"}>{status}</Tag>
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
    <div className="announcements-container">
      <h2 className="announcements-title">
        <NotificationOutlined /> Announcements Management
      </h2>

      <Card className="announcements-card">
        <h3 className="announcements-subtitle">
          <FileTextOutlined /> Create a New Announcement
        </h3>

        <Form
          requiredMark={false}
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="announcements-form"
        >
          {/* Announcement Title */}
          <Form.Item
            name="title"
            label="Announcement Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input
              prefix={<FileTextOutlined />}
              placeholder="Enter announcement title"
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

          {/* Announcement Date */}
          <Form.Item
            name="date"
            label="Announcement Date"
            rules={[{ required: true, message: "Select a date" }]}
          >
            <DatePicker
              className="announcements-date"
              prefix={<CalendarOutlined />}
            />
          </Form.Item>

          {/* Announcement Content */}
          <Form.Item
            name="content"
            label="Announcement Content"
            rules={[{ required: true, message: "Enter announcement details" }]}
          >
            <TextArea rows={4} placeholder="Enter announcement details..." />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="announcements-submit-button"
            >
              Publish Announcement
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <br />
      {/* Announcements Table */}
      <Card className="announcements-card">
        <h3 className="announcements-subtitle">
          <ClockCircleOutlined /> Scheduled Announcements
        </h3>
        <Table
          columns={columns}
          dataSource={announcements}
          pagination={{ pageSize: 4 }}
        />
      </Card>
    </div>
  );
};

export default Announcements;
