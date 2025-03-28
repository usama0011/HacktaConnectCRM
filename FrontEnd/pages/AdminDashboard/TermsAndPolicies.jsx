import React, { useState } from "react";
import { Card, Form, Input, Button, Table, Tag, message } from "antd";
import {
  FileProtectOutlined,
  FileTextOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "../../styles/TermsAndPolicies.css";

const { TextArea } = Input;

const TermsAndPolicies = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [policies, setPolicies] = useState([
    {
      key: "1",
      title: "User Agreement",
      status: "Published",
      date: "March 1, 2024",
    },
    {
      key: "2",
      title: "Privacy Policy",
      status: "Draft",
      date: "March 10, 2024",
    },
    {
      key: "3",
      title: "Refund Policy",
      status: "Published",
      date: "March 15, 2024",
    },
  ]);

  const handleSubmit = (values) => {
    setLoading(true);
    setTimeout(() => {
      const newPolicy = {
        key: (policies.length + 1).toString(),
        title: values.title,
        status: "Draft",
        date: new Date().toLocaleDateString(),
      };
      setPolicies([...policies, newPolicy]);
      message.success(`Policy "${values.title}" has been created as a Draft.`);
      form.resetFields();
      setLoading(false);
    }, 1500);
  };

  // Table Columns
  const columns = [
    {
      title: "Policy Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Published" ? "green" : "blue"}>{status}</Tag>
      ),
    },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Actions",
      key: "action",
      render: () => (
        <Button type="primary" size="small">
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="terms-container">
      <h2 className="terms-title">
        <FileProtectOutlined /> Terms & Policies Management
      </h2>

      <Card className="terms-card">
        <h3 className="terms-subtitle">
          <FileTextOutlined /> Create New Policy
        </h3>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="terms-form"
        >
          {/* Policy Title */}
          <Form.Item
            name="title"
            label="Policy Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input
              prefix={<FileTextOutlined />}
              placeholder="Enter policy title"
            />
          </Form.Item>

          {/* Policy Content */}
          <Form.Item
            name="content"
            label="Policy Content"
            rules={[{ required: true, message: "Enter policy details" }]}
          >
            <TextArea rows={4} placeholder="Enter policy details..." />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="terms-submit-button"
            >
              <PlusOutlined /> Add Policy
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <br />
      {/* Policies Table */}
      <Card className="terms-card">
        <h3 className="terms-subtitle">
          <FileTextOutlined /> Existing Policies
        </h3>
        <Table
          columns={columns}
          dataSource={policies}
          pagination={{ pageSize: 4 }}
        />
      </Card>
    </div>
  );
};

export default TermsAndPolicies;
