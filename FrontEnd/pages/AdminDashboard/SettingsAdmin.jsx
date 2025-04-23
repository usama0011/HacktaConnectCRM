import React, { useState } from "react";
import { Card, Form, Select, Typography, Row, Col } from "antd";
import "../../styles/SettingsAdmin.css";

const { Title, Text } = Typography;
const { Option } = Select;

const SettingsAdmin = () => {
  const [filters, setFilters] = useState({
    branch: "Branch A",
    shift: "Morning",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="settings-admin-container">
      <Title level={3} className="settings-title">
        ⚙️ Admin Settings Panel
      </Title>

      <Row gutter={24}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Select Branch">
            <Select
              defaultValue={filters.branch}
              onChange={(value) => handleFilterChange("branch", value)}
            >
              <Option value="Branch A">Branch A</Option>
              <Option value="Branch B">Branch B</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Select Shift">
            <Select
              defaultValue={filters.shift}
              onChange={(value) => handleFilterChange("shift", value)}
            >
              <Option value="Morning">Morning</Option>
              <Option value="Evening">Evening</Option>
              <Option value="Night">Night</Option>
              <Option value="All Shifts">All Shifts</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Card className="json-code-card" title="Current Filters">
        <pre className="json-output">
          {`{
  "branch": "${filters.branch}",
  "shift": "${filters.shift}"
}`}
        </pre>
      </Card>
    </div>
  );
};

export default SettingsAdmin;
