import React, { useState, useEffect } from "react";
import { Layout, Menu, Dropdown, Tooltip, Input, Button, Avatar } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  SettingOutlined,
  LogoutOutlined,
  SearchOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import "../styles/AdminDashboard.css";
import Sidebar from "./SideBar";
import { useUserContext } from "../context/UserContext";
import QuickAccessModal from "./QuickAccessModal";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const { user } = useUserContext();
  const inputRef = React.useRef(null);
  const navigate = useNavigate();
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Toggle function
  const toggleMobileSidebar = () => {
    setIsMobileSidebarVisible(!isMobileSidebarVisible);
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const menu = (
    <Menu>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <span onClick={() => navigate("/admin/settings")}>Settings</span>
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        <span onClick={handleLogout}>Logout</span>
      </Menu.Item>
    </Menu>
  );
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        console.log("helo");
        setIsMobileSidebarVisible(false); // auto-hide when becoming mobile
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <Layout className="admin-dashboard-layout">
      <Sidebar
        visible={isMobileSidebarVisible}
        onClose={() => setIsMobileSidebarVisible(false)}
      />

      {/* Header */}

      {/* Content */}
      <Content className="admin-dashboard-content">
        <Header className="custom-admin-header">
          <div className="mobile-menu-icon" onClick={toggleMobileSidebar}>
            {isMobileSidebarVisible}
            <MenuOutlined />
          </div>
          <div className="header-left">
            <h1>Hello,{user?.agentName}</h1>
          </div>

          <div className="header-center">
            <Input
              ref={inputRef}
              className="header-search"
              placeholder="Search here..."
              onFocus={() => setIsModalVisible(true)}
              prefix={<SearchOutlined />}
            />
          </div>
          <QuickAccessModal
            visible={isModalVisible}
            onClose={() => {
              setIsModalVisible(false);
              setSearchValue("");
              inputRef.current?.blur(); // ✅ Remove focus
            }}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />

          <div className="header-right">
            <Dropdown overlay={menu} trigger={["click"]}>
              <Avatar
                src={user?.userImage}
                className="header-avatar"
                style={{ cursor: "pointer" }}
              />
            </Dropdown>
          </div>
        </Header>
        <br />
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AdminLayout;
