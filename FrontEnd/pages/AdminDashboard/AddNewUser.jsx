import React, { useState } from "react";
import { Form, Input, Select, Button, Card, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import "../../styles/AddNewUser.css";

const { Option } = Select;

const AddNewUser = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values) => {
    setLoading(true);
    setTimeout(() => {
      message.success(`User "${values.username}" added successfully!`);
      form.resetFields();
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="newUser-container">
      <Card className="newUser-card">
        <h2 className="newUser-title">Add New User</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="newUser-form"
        >
          {/* Username */}
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter username" />
          </Form.Item>

          {/* Password */}
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter password"
            />
          </Form.Item>

          {/* Role Selection */}
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Select a role" }]}
          >
            <Select placeholder="Select role">
              <Option value="superadmin">Super Admin</Option>
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>

          {/* Shift Selection */}
          <Form.Item
            name="shift"
            label="Shift"
            rules={[{ required: true, message: "Select a shift" }]}
          >
            <Select placeholder="Select shift">
              <Option value="morning">Morning</Option>
              <Option value="evening">Evening</Option>
              <Option value="night">Night</Option>
            </Select>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="newUser-submit-button"
            >
              Add User
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddNewUser;
