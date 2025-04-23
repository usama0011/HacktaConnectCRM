import { useState } from "react";
import {
  DashboardOutlined,
  BarChartOutlined,
  UserOutlined,
  FolderOpenOutlined,
  NotificationOutlined,
  FileTextOutlined,
  FileProtectOutlined,
  DollarCircleOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  DatabaseFilled,
  CalendarFilled,
  CalendarOutlined,
  DotChartOutlined,
} from "@ant-design/icons";
import "../styles/SideBar.css";
import { Button, Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import MainWebSiteLogo from "../src/assets/mainlogo.jpeg";
const { Sider } = Layout;

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Sider
      width={250}
      collapsedWidth={70}
      collapsed={!isHovered}
      trigger={null}
      className={`bitrix-sidebar ${isHovered ? "expanded" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: "fixed", height: "100vh", left: 0 }}
    >
      <div className="sidebar-content-wrapper">
        <div className="sidebar-logo">
          <img src={MainWebSiteLogo} alt="Logo" />
        </div>

        <div className="sidebar-scrollable">
          <Menu
            mode="inline"
            theme="dark"
            className={`bitrix-menu ${isHovered ? "show-labels" : ""}`}
            inlineCollapsed={!isHovered}
          >
            <Menu.Item
              key="1"
              icon={<DashboardOutlined className="sidebariconspecial" />}
            >
              <Link to="/admin/dashboard">Dashboard</Link>{" "}
            </Menu.Item>{" "}
            <Menu.Item
              key="2"
              icon={<BarChartOutlined className="sidebariconspecial" />}
            >
              <Link to="/admin/dashboard/proxyusage">Proxy Usage</Link>{" "}
            </Menu.Item>{" "}
            <Menu.SubMenu
              key="3"
              icon={<UserOutlined className="sidebariconspecial" />}
              title="Manage Users"
            >
              {" "}
              <Menu.Item key="3-1">
                <Link to="/admin/dashboard/manageusers">All Users</Link>{" "}
              </Menu.Item>{" "}
              <Menu.Item key="3-2">
                <Link to="/admin/dashboard/addnewuser">Add User</Link>{" "}
              </Menu.Item>
            </Menu.SubMenu>{" "}
            <Menu.Item
              key="13"
              icon={<CalendarOutlined className="sidebariconspecial" />}
            >
              <Link to="/admin/dashboard/allusersattandance">
                Agents Attandance
              </Link>{" "}
            </Menu.Item>
            <Menu.SubMenu
              key="14"
              icon={<DotChartOutlined className="sidebariconspecial" />}
              title="Agent Reports"
            >
              <Menu.Item key="14-1">
                <Link to="/admin/dashboard/ipreportsusers">
                  Agents IP Reports
                </Link>
              </Menu.Item>
              <Menu.Item key="14-2">
                <Link to="/admin/dashboard/AllQCPoints">Agent QC Reports</Link>{" "}
              </Menu.Item>
              <Menu.Item key="13-3">
                <Link to="/admin/dashboard/addqcpointform">Add QC Points</Link>{" "}
              </Menu.Item>{" "}
              <Menu.Item key="13-4">
                <Link to="/admin/dashboard/dailyipreport">
                  Agents Daily IPs
                </Link>{" "}
              </Menu.Item>{" "}
            </Menu.SubMenu>
            <Menu.Item
              key="7"
              icon={<DollarCircleOutlined className="sidebariconspecial" />}
            >
              {" "}
              <Link to="/admin/dashboard/salarymanagement">
                Salary Management
              </Link>{" "}
            </Menu.Item>{" "}
            <Menu.Item
              key="4"
              icon={<NotificationOutlined className="sidebariconspecial" />}
            >
              <Link to="/admin/dashboard/noticeboard">Notice Board</Link>{" "}
            </Menu.Item>{" "}
            <Menu.Item
              key="6"
              icon={<FileProtectOutlined className="sidebariconspecial" />}
            >
              <Link to="/admin/dashboard/announcements">Announcements</Link>{" "}
            </Menu.Item>{" "}
            <Menu.Item
              key="8"
              icon={<SettingOutlined className="sidebariconspecial" />}
            >
              <Link to="/admin/dashboard/settings">Settings</Link>{" "}
            </Menu.Item>{" "}
            <Menu.SubMenu
              key="9"
              icon={<DatabaseFilled className="sidebariconspecial" />}
              title="Task Creation"
            >
              {" "}
              <Menu.Item key="9-1">
                <Link to="/admin/dashboard/newtask">New Task</Link>{" "}
              </Menu.Item>{" "}
              <Menu.Item key="9-2">
                {" "}
                <Link to="/admin/dashboard/viewtaskcreation">
                  View Creations
                </Link>{" "}
              </Menu.Item>{" "}
            </Menu.SubMenu>{" "}
            <Menu.Item
              key="10"
              icon={<FileProtectOutlined className="sidebariconspecial" />}
            >
              {" "}
              <Link to="/admin/dashboard/termsandpolicies">
                Terms & Policies
              </Link>{" "}
            </Menu.Item>{" "}
            <Menu.Item
              key="11"
              icon={<BellOutlined className="sidebariconspecial" />}
            >
              <Link to="/admin/dashboard/notifications">Notifications</Link>{" "}
            </Menu.Item>
            {/* Add QCPintins */}{" "}
          </Menu>
        </div>

        <div className="admin-sidebar-footer">
          <Button
            className="admin-logout-btn"
            icon={<LogoutOutlined />}
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            {isHovered && "Logout"}
          </Button>
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
