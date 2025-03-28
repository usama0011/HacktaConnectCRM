import React, { useState } from "react";
import { Layout, Menu, Tooltip, Row, Col, Input, Button, Avatar } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  FolderOpenOutlined,
  NotificationOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  DollarCircleOutlined,
  FileProtectOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  QuestionCircleOutlined,
  AppstoreAddOutlined,
  CodeOutlined,
  EditOutlined,
  CloudOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import MainWebSiteLogo from "../../src/assets/mainlogo.jpeg";
import "../../styles/AdminDashboard.css";

const { Header, Sider, Content } = Layout;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    message.success("You have been logged out successfully.");
    navigate("/login");
  };

  return (
    <div>
      <div>
        <Content className="">
          <Row gutter={[24, 24]} className="dashboard-cards">
            {[
              {
                icon: <UserOutlined className="card-icon" />,
                title: "Overview",
                description: "All pages Overview",
              },
              {
                icon: <UserOutlined className="card-icon" />,
                title: "Consultation",
                description: "Testing & Analyze",
              },
              {
                icon: <CodeOutlined className="card-icon" />,
                title: "Develop",
                description: "Advanced Solutions",
              },
              {
                icon: <EditOutlined className="card-icon" />,
                title: "Creation",
                description: "Create, Update, Delete",
              },
              {
                icon: <FileTextOutlined className="card-icon" />,
                title: "Reports",
                description: "Performance Tracking",
              },
              {
                icon: <NotificationOutlined className="card-icon" />,
                title: "Announcements",
                description: "Latest Updates",
              },
              {
                icon: <DollarCircleOutlined className="card-icon" />,
                title: "Salary",
                description: "Manage Payroll",
              },
              {
                icon: <BarChartOutlined className="card-icon" />,
                title: "Performance",
                description: "Performance Management",
              },
              {
                icon: <SettingOutlined className="card-icon" />,
                title: "Settings",
                description: "System Settings",
              },
              {
                icon: <CloudOutlined className="card-icon" />,
                title: "Proxy Usage",
                description: "Proxy & Security",
              },
              {
                icon: <SafetyCertificateOutlined className="card-icon" />,
                title: "Terms & Conditions",
                description: "Policies & Compliance",
              },
            ].map((card, index) => (
              <Col key={index} xs={24} sm={12} md={6}>
                <div className="wavy-card">
                  <div className="card-content">
                    <div className="icon-container">{card.icon}</div>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </div>
                  <svg
                    style={{ transform: "rotate(180deg)" }}
                    className="mysvgcard"
                    viewBox="0 0 500 150"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z"
                      style={{ fill: "#032212" }}
                    ></path>
                  </svg>
                </div>
              </Col>
            ))}
          </Row>
          {/* Bottom Right Wave */}

          <Outlet />
        </Content>
      </div>
    </div>
  );
};

export default AdminDashboard;
