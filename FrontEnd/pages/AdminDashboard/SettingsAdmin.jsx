import React, { useState } from "react";
import { Card, Form, Input, Select, Switch, Button, message, Tabs } from "antd";
import {
  SettingOutlined,
  UserOutlined,
  LockOutlined,
  CloudOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import "../../styles/SettingsAdmin.css";

const { Option } = Select;
const { TabPane } = Tabs;

const SettingsAdmin = () => {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      message.success("Settings have been saved successfully!");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">
        <SettingOutlined /> Admin Settings
      </h2>

      <Card className="settings-card">
        <Tabs defaultActiveKey="1" className="settings-tabs">
          {/* General Settings */}
          <TabPane tab="General Settings" key="1">
            <Form layout="vertical">
              <Form.Item label="System Name">
                <Input
                  prefix={<CloudOutlined />}
                  placeholder="Enter system name"
                />
              </Form.Item>

              <Form.Item label="Admin Contact Email">
                <Input
                  type="email"
                  prefix={<UserOutlined />}
                  placeholder="admin@example.com"
                />
              </Form.Item>

              <Form.Item label="Enable Maintenance Mode">
                <Switch checkedChildren="On" unCheckedChildren="Off" />
              </Form.Item>

              <Button
                type="primary"
                loading={loading}
                onClick={handleSave}
                className="settings-save-button"
              >
                Save Changes
              </Button>
            </Form>
          </TabPane>

          {/* User Management */}
          <TabPane tab="User Management" key="2">
            <Form layout="vertical">
              <Form.Item label="Default User Role">
                <Select>
                  <Option value="user">User</Option>
                  <Option value="admin">Admin</Option>
                  <Option value="superadmin">Super Admin</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Allow Self Registration">
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>

              <Button
                type="primary"
                loading={loading}
                onClick={handleSave}
                className="settings-save-button"
              >
                Save Changes
              </Button>
            </Form>
          </TabPane>

          {/* Security Settings */}
          <TabPane tab="Security" key="3">
            <Form layout="vertical">
              <Form.Item label="Password Policy">
                <Select>
                  <Option value="medium">Medium</Option>
                  <Option value="strong">Strong</Option>
                  <Option value="very-strong">Very Strong</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Enable Two-Factor Authentication">
                <Switch
                  checkedChildren="Enabled"
                  unCheckedChildren="Disabled"
                />
              </Form.Item>

              <Form.Item label="Session Timeout (Minutes)">
                <Input type="number" placeholder="Enter session timeout" />
              </Form.Item>

              <Button
                type="primary"
                loading={loading}
                onClick={handleSave}
                className="settings-save-button"
              >
                Save Changes
              </Button>
            </Form>
          </TabPane>

          {/* Database & Backup Settings */}
          <TabPane tab="Database & Backup" key="4">
            <Form layout="vertical">
              <Form.Item label="Database Type">
                <Select>
                  <Option value="mysql">MySQL</Option>
                  <Option value="mongodb">MongoDB</Option>
                  <Option value="postgresql">PostgreSQL</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Enable Auto Backup">
                <Switch
                  checkedChildren="Enabled"
                  unCheckedChildren="Disabled"
                />
              </Form.Item>

              <Button
                type="primary"
                loading={loading}
                onClick={handleSave}
                className="settings-save-button"
              >
                Save Changes
              </Button>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SettingsAdmin;
