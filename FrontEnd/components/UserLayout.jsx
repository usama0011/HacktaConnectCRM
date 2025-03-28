import React, { useState } from "react";
import { Layout, Menu, Tooltip, Input, Button, Avatar } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  CalendarOutlined,
  BellOutlined,
  SettingOutlined,
  FileTextOutlined,
  UploadOutlined,
  FolderOpenOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import MainWebSiteLogo from "../src/assets/mainlogo.jpeg";
import "../styles/UserDashboard.css";

const { Header, Sider, Content } = Layout;

const UserLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Layout className="user-dashboard-layout">
      {/* Sidebar */}
      <Sider
        className="user-dashboard-sider"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <div className="user-logo">
          {!collapsed ? "Hackta CRM" : <MenuFoldOutlined />}
        </div>

        <Menu
          className="custom-user-menu"
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/user/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/user/dashboard/myprofile">My Profile</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<FileTextOutlined />}>
            <Link to="/user/dashboard/myrecord">My Records</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<CalendarOutlined />}>
            <Link to="/user/dashboard/noticecalendar">Notice Calendar</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<BellOutlined />}>
            <Link to="/user/dashboard/notifications">Notifications</Link>
          </Menu.Item>
          <Menu.Item key="6" icon={<FolderOpenOutlined />}>
            <Link to="/user/dashboard/usertasks">User Tasks</Link>
          </Menu.Item>
          <Menu.Item key="7" icon={<UploadOutlined />}>
            <Link to="/user/dashboard/uploadwork">Upload Work</Link>
          </Menu.Item>
          <Menu.Item key="8" icon={<SettingOutlined />}>
            <Link to="/user/dashboard/settings">Settings</Link>
          </Menu.Item>
          <Menu.Item key="9" icon={<FileTextOutlined />}>
            <Link to="/user/dashboard/termsandpolicies">Terms & Policies</Link>
          </Menu.Item>
          <Menu.Item key="10" icon={<QuestionCircleOutlined />}>
            <Link to="/user/dashboard/faqs">Faqs</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header className="user-navbar">
          <div className="navbar-left">
            <img src={MainWebSiteLogo} alt="Logo" className="navbar-logo" />
            <span className="navbar-title">Hackta Connect CRM</span>
          </div>
          <div className="navbar-center">
            <Input
              className="search-bar"
              placeholder="Search..."
              prefix={<SearchOutlined />}
            />
          </div>
          <div className="navbar-right">
            <Tooltip title="Help">
              <QuestionCircleOutlined className="navbar-icon" />
            </Tooltip>
            <Tooltip title="Profile">
              <Avatar
                src="https://img.icons8.com/?size=60&id=FZQamLEORsJ1&format=png"
                className="navbar-avatar"
              />
            </Tooltip>
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="navbar-logout"
            >
              Logout
            </Button>
          </div>
        </Header>

        {/* Content */}
        <Content className="user-dashboard-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserLayout;
