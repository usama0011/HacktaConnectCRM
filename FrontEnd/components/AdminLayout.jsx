import React, { useState } from "react";
import { Layout, Menu, Tooltip, Input, Button, Avatar } from "antd";
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
  BellOutlined,
  SearchOutlined,
  QuestionCircleOutlined,
  AppstoreAddOutlined,
  DatabaseFilled,
  NumberOutlined,
} from "@ant-design/icons";
import MainWebSiteLogo from "../src/assets/mainlogo.jpeg";
import "../styles/AdminDashboard.css";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Layout className="admin-dashboard-layout">
      {/* Sidebar */}
      <Sider
        className="admin-dashboard-sider"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <div className="admin-logo">
          {!collapsed ? "Hackta CRM" : <MenuFoldOutlined />}
        </div>

        <Menu
          className="custom-admin-menu"
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/admin/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<BarChartOutlined />}>
            <Link to="/admin/dashboard/proxyusage">Proxy Usage</Link>
          </Menu.Item>
          <Menu.SubMenu key="3" icon={<UserOutlined />} title="Manage Users">
            <Menu.Item key="3-1">
              <Link to="/admin/dashboard/manageusers">All Users</Link>
            </Menu.Item>
            <Menu.Item key="3-2">
              <Link to="/admin/dashboard/addnewuser">Add User</Link>
            </Menu.Item>
            <Menu.Item key="3-3">
              <Link to="/admin/dashboard/ipreportsusers">IP Reports Users</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="4" icon={<FolderOpenOutlined />} title="Analytics">
            <Menu.Item key="4-1">
              <Link to="/admin/dashboard/performancemetrics">
                Performance Metrics
              </Link>
            </Menu.Item>
            <Menu.Item key="4-2">
              <Link to="/admin/dashboard/reporting">User Reports</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="5" icon={<NotificationOutlined />}>
            <Link to="/admin/dashboard/noticeboard">Notice Board</Link>
          </Menu.Item>
          <Menu.Item key="6" icon={<FileTextOutlined />}>
            <Link to="/admin/dashboard/reportsgenerate">Reports</Link>
          </Menu.Item>
          <Menu.Item key="7" icon={<FileProtectOutlined />}>
            <Link to="/admin/dashboard/announcements">Announcements</Link>
          </Menu.Item>
          <Menu.Item key="8" icon={<DollarCircleOutlined />}>
            <Link to="/admin/dashboard/salarymanagement">
              Salary Management
            </Link>
          </Menu.Item>
          <Menu.Item key="9" icon={<SettingOutlined />}>
            <Link to="/admin/dashboard/settings">Settings</Link>
          </Menu.Item>
          <Menu.Item key="11" icon={<DatabaseFilled />}>
            <Link to="/admin/dashboard/taskcreation">Task Creations</Link>
          </Menu.Item>
          <Menu.Item key="12" icon={<FileProtectOutlined />}>
            <Link to="/admin/dashboard/termsandpolicies">Terms & Policies</Link>
          </Menu.Item>
          <Menu.Item key="13" icon={<BellOutlined />}>
            <Link to="/admin/dashboard/notifications">Notifications</Link>
          </Menu.Item>

          {/* Add QCPintins */}
          <Menu.SubMenu key="14" icon={<UserOutlined />} title="QCs">
            <Menu.Item key="14-1">
              <Link to="/admin/dashboard/addqcpointform">Add QC Points</Link>
            </Menu.Item>
            <Menu.Item key="14-2">
              <Link to="/admin/dashboard/AllQCPoints">All Users QCs</Link>
            </Menu.Item>
            <Menu.Item key="13-3">
              <Link to="/admin/dashboard/allusersattandance">
                All Users Attandance
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>

        {/* Logout Button
        <div className="sidebar-footer">
          <Tooltip title={!collapsed ? "" : "Logout"}>
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="logout-button"
            >
              {!collapsed && "Logout"}
            </Button>
          </Tooltip>
        </div> */}
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header className="admin-navbar">
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
            <Tooltip title="Settings">
              <SettingOutlined className="navbar-icon" />
            </Tooltip>
            <Tooltip title="Apps">
              <AppstoreAddOutlined className="navbar-icon" />
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
        <Content className="admin-dashboard-content">
          <Outlet />
        </Content>
        <div className="wave-container">
          <svg
            className="dashboard-bottom-wave"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="rgba(3, 34, 18, 0.3)"
              d="M0,160L60,165.3C120,171,240,181,360,186.7C480,192,600,192,720,186.7C840,181,960,171,1080,154.7C1200,139,1320,117,1380,106.7L1440,96V320H0Z"
            ></path>
            <path
              fill="rgba(3, 34, 18, 0.5)"
              d="M0,192L60,186.7C120,181,240,171,360,154.7C480,139,600,117,720,122.7C840,128,960,160,1080,165.3C1200,171,1320,149,1380,138.7L1440,128V320H0Z"
            ></path>
            <path
              fill="rgba(3, 34, 18, 0.8)"
              d="M0,224L60,229.3C120,235,240,245,360,234.7C480,224,600,192,720,165.3C840,139,960,117,1080,106.7C1200,96,1320,96,1380,96L1440,96V320H0Z"
            ></path>
          </svg>
        </div>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
