import React from "react";
import { Card, Row, Col, Statistic, Progress } from "antd";
import {
  FileTextOutlined,
  CalendarOutlined,
  BellOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "../../styles/UserDashboard.css";

const UserDashboard = () => {
  return (
    <div className="user-dashboard-container">
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="user-card">
            <Statistic
              title="Tasks Completed"
              value={35}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="user-card">
            <Statistic
              title="Upcoming Notices"
              value={5}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="user-card">
            <Statistic
              title="New Notifications"
              value={12}
              prefix={<BellOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="user-card">
            <Statistic
              title="Uploaded Work"
              value={10}
              prefix={<UploadOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="progress-row">
        <Col span={12}>
          <Card title="Work Progress">
            <Progress percent={75} status="active" />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Task Completion">
            <Progress percent={60} status="active" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserDashboard;
