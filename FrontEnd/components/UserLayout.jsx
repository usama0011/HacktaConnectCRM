import React, { useState } from "react";
import { Layout, Menu, Tooltip, Input, Button, Avatar, Dropdown } from "antd";
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
  AppstoreAddOutlined,
  QuestionCircleOutlined,
  CalculatorOutlined,
} from "@ant-design/icons";
import MainWebSiteLogo from "../src/assets/mainlogo.jpeg";
import "../styles/UserDashboard.css";

const { Header, Sider, Content } = Layout;

const UserLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // ✅ Add this state

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const avatarMenu = (
    <Menu>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <span onClick={() => navigate("/user/dashboard/settings")}>
          Settings
        </span>
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        <span onClick={handleLogout}>Logout</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout
      className="user-dashboard-layout"
      style={{ minHeight: "100vh", position: "relative" }}
    >
      {/* Sidebar */}
      <Sider
        width={260}
        collapsedWidth={70}
        trigger={null}
        collapsible
        collapsed={!isExpanded}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`bitrix-sidebar ${isExpanded ? "expanded" : ""}`}
      >
        <div className="sidebar-logo">
          <img src={MainWebSiteLogo} alt="Logo" />
        </div>

        <Menu
          className="bitrix-menu"
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          inlineCollapsed={!isExpanded}
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
          <Menu.Item key="7" icon={<CalculatorOutlined />}>
            <Link to="/user/dashboard/generalsalarycalculator">
              Salary Calculator
            </Link>
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

        <div className="user-sidebar-footer">
          <Button
            className="user-logout-btn"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            {isExpanded && "Logout"}
          </Button>
        </div>
      </Sider>

      {/* Main Layout */}

      {/* Content */}
      <Content className="user-dashboard-content">
        <Header className="custom-user-header">
          <div className="header-left">
            <h2>Welcome Usama!</h2>
          </div>

          <div className="header-center">
            <Input
              className="header-search"
              placeholder="Search here..."
              prefix={<SearchOutlined />}
            />
          </div>

          <div className="header-right">
            <Dropdown overlay={avatarMenu} trigger={["click"]}>
              <Avatar
                src="https://img.icons8.com/?size=60&id=FZQamLEORsJ1&format=png"
                className="header-avatar"
                style={{ cursor: "pointer" }}
              />
            </Dropdown>
          </div>
        </Header>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default UserLayout;
