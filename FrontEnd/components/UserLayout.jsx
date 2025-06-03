import React, { useState, useEffect } from "react";
import { Layout, Menu, Tooltip, Input, Button, Avatar, Dropdown } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  XOutlined,
  UserOutlined,
  MenuOutlined,
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
import { useUserContext } from "../context/UserContext";

const { Header, Sider, Content } = Layout;

const UserLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // ✅ Add this state
  const { user } = useUserContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarVisible, setIsSidebarVisible] = useState(!isMobile);

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
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Listen for resize to toggle mobile state
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsSidebarVisible(!mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <Layout
      className="user-dashboard-layout"
      style={{ minHeight: "100vh", position: "relative" }}
    >
      {isSidebarVisible && (
        <Sider
          width={260}
          collapsedWidth={70}
          trigger={null}
          collapsible
          collapsed={!isExpanded}
          onMouseEnter={() => !isMobile && setIsExpanded(true)}
          onMouseLeave={() => !isMobile && setIsExpanded(false)}
          className={`bitrix-sidebar ${
            isExpanded || isMobile ? "expanded" : ""
          }`}
        >
          <div className="sidebar-logo">
            <img src={MainWebSiteLogo} alt="Logo" />
          </div>
          {isMobile && (
            <Button
              type="text"
              icon={
                isSidebarVisible ? (
                  <XOutlined style={{ color: "black" }} />
                ) : (
                  <XOutlined style={{ color: "black" }} />
                )
              }
              onClick={toggleSidebar}
              className="toggle-sidebar-btn"
            />
          )}
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
            <Menu.Item key="7" icon={<UploadOutlined />}>
              <Link to="/user/dashboard/uploadwork">Upload Work</Link>
            </Menu.Item>
            <Menu.Item key="8" icon={<CalculatorOutlined />}>
              <Link to="/user/dashboard/generalsalarycalculator">
                Salary Calculator
              </Link>
            </Menu.Item>
            <Menu.Item key="9" icon={<SettingOutlined />}>
              <Link to="/user/dashboard/settings">Settings</Link>
            </Menu.Item>
            <Menu.Item key="10" icon={<FileTextOutlined />}>
              <Link to="/user/dashboard/termsandpolicies">
                Terms & Policies
              </Link>
            </Menu.Item>
            <Menu.Item key="11" icon={<QuestionCircleOutlined />}>
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
      )}

      {/* Main Layout */}

      {/* Content */}
      <Content className="user-dashboard-content">
        <Header className="custom-user-header">
          <div>
            {isMobile && (
              <Button
                type="text"
                icon={
                  isSidebarVisible ? (
                    <MenuOutlined style={{ color: "black" }} />
                  ) : (
                    <MenuOutlined style={{ color: "black" }} />
                  )
                }
                onClick={toggleSidebar}
                className="toggle-sidebar-btn"
              />
            )}
          </div>
          <div className="header-left">
            <h2>Welcome {user?.username}!</h2>
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
                src={user.userImage}
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
