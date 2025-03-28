import React, { useState } from "react";
import { Card, Form, Input, Select, Button, DatePicker, message } from "antd";
import {
  NotificationOutlined,
  FileTextOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import "../../styles/NoticeBoardCreation.css";

const { Option } = Select;
const { TextArea } = Input;

const NoticeBoardCreation = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values) => {
    setLoading(true);
    setTimeout(() => {
      message.success(
        `Notice "${values.title}" has been published successfully!`
      );
      form.resetFields();
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="noticeboard-container">
      <Card className="noticeboard-card">
        <h2 className="noticeboard-title">
          <NotificationOutlined /> Create a Notice
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="noticeboard-form"
        >
          {/* Notice Title */}
          <Form.Item
            name="title"
            label="Notice Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input
              prefix={<FileTextOutlined />}
              placeholder="Enter notice title"
            />
          </Form.Item>

          {/* Notice Audience */}
          <Form.Item
            name="audience"
            label="Audience"
            rules={[{ required: true, message: "Select an audience" }]}
          >
            <Select placeholder="Select audience">
              <Option value="all">All Employees</Option>
              <Option value="agents">Agents Only</Option>
              <Option value="users">Users Only</Option>
            </Select>
          </Form.Item>

          {/* Notice Date */}
          <Form.Item
            name="date"
            label="Notice Date"
            rules={[{ required: true, message: "Select a date" }]}
          >
            <DatePicker
              className="noticeboard-date"
              prefix={<CalendarOutlined />}
            />
          </Form.Item>

          {/* Notice Content */}
          <Form.Item
            name="content"
            label="Notice Content"
            rules={[{ required: true, message: "Enter notice details" }]}
          >
            <TextArea rows={4} placeholder="Enter notice details..." />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="noticeboard-submit-button"
            >
              Publish Notice
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default NoticeBoardCreation;
