import React, { useState } from "react";
import { Layout, Menu, Dropdown, Tooltip, Input, Button, Avatar } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  SettingOutlined,
  LogoutOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import MainWebSiteLogo from "../src/assets/mainlogo.jpeg";
import LogoutMainCharactor from "../src/assets/logoutcharactor.png";
import "../styles/AdminDashboard.css";
import Sidebar from "./SideBar";
import { useUserContext } from "../context/UserContext";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

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
  return (
    <Layout className="admin-dashboard-layout">
      <Sidebar />

      {/* Header */}

      {/* Content */}
      <Content className="admin-dashboard-content">
        <Header className="custom-admin-header">
          <div className="header-left">
            <h1>Hello,{user?.agentName}</h1>
          </div>

          <div className="header-center">
            <Input
              className="header-search"
              placeholder="Search here..."
              prefix={<SearchOutlined />}
            />
          </div>

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
