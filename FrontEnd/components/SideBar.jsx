import { useEffect, useState } from "react";
import {
  DashboardOutlined,
  BarChartOutlined,
  UserOutlined,
  FileProtectOutlined,
  DollarCircleOutlined,
  SettingOutlined,
  LogoutOutlined,
  CalendarOutlined,
  DotChartOutlined,
} from "@ant-design/icons";
import "../styles/SideBar.css";
import { Button, Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import MainWebSiteLogo from "../src/assets/mainlogo.jpeg";

const { Sider } = Layout;

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/manageusers") || path.includes("/addnewuser")) {
      setOpenKeys(["/admin/dashboard/manageusers"]);
    } else if (
      path.includes("/ipreportsusers") ||
      path.includes("/AllQCPoints") ||
      path.includes("/addqcpointform") ||
      path.includes("/dailyipreport")
    ) {
      setOpenKeys(["/admin/dashboard/ipreportsusers"]);
    }
  }, [location.pathname]);

  // Highlight parent menu when in child route
  const getHighlightedKey = () => {
    const path = location.pathname;
    if (path.includes("/manageusers") || path.includes("/addnewuser")) {
      return "/admin/dashboard/manageusers";
    }
    if (
      path.includes("/ipreportsusers") ||
      path.includes("/AllQCPoints") ||
      path.includes("/addqcpointform") ||
      path.includes("/dailyipreport")
    ) {
      return "/admin/dashboard/ipreportsusers";
    }
    return location.pathname;
  };

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
            theme="light"
            selectedKeys={[getHighlightedKey()]}
            openKeys={isHovered ? openKeys : []}
            onOpenChange={handleOpenChange}
            className={`bitrix-menu ${isHovered ? "show-labels" : ""}`}
            inlineCollapsed={!isHovered}
          >
            <Menu.Item
              key="/admin/dashboard"
              icon={<DashboardOutlined className="sidebariconspecial" />}
            >
              <Link to="/admin/dashboard">Dashboard</Link>
            </Menu.Item>

            <Menu.Item
              key="/admin/dashboard/proxyusage"
              icon={<BarChartOutlined className="sidebariconspecial" />}
            >
              <Link to="/admin/dashboard/proxyusage">Proxy Usage</Link>
            </Menu.Item>

            <Menu.SubMenu
              key="/admin/dashboard/manageusers"
              icon={<UserOutlined className="sidebariconspecial" />}
              title="Manage Users"
            >
              <Menu.Item key="/admin/dashboard/manageusers">
                <Link to="/admin/dashboard/manageusers">All Users</Link>
              </Menu.Item>
              <Menu.Item key="/admin/dashboard/addnewuser">
                <Link to="/admin/dashboard/addnewuser">Add User</Link>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.Item
              key="/admin/dashboard/allusersattandance"
              icon={<CalendarOutlined className="sidebariconspecial" />}
            >
              <Link to="/admin/dashboard/allusersattandance">
                Agents Attendance
              </Link>
            </Menu.Item>

            <Menu.SubMenu
              key="/admin/dashboard/ipreportsusers"
              icon={<DotChartOutlined className="sidebariconspecial" />}
              title="Agent Reports"
            >
              <Menu.Item key="/admin/dashboard/ipreportsusers">
                <Link to="/admin/dashboard/ipreportsusers">
                  Agents IP Reports
                </Link>
              </Menu.Item>
              <Menu.Item key="/admin/dashboard/AllQCPoints">
                <Link to="/admin/dashboard/AllQCPoints">
                  Agent QC Reports
                </Link>
              </Menu.Item>
              <Menu.Item key="/admin/dashboard/addqcpointform">
                <Link to="/admin/dashboard/addqcpointform">Add QC Points</Link>
              </Menu.Item>
              <Menu.Item key="/admin/dashboard/dailyipreport">
                <Link to="/admin/dashboard/dailyipreport">
                  Agents Daily IPs
                </Link>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.Item
              key="/admin/dashboard/salarymanagement"
              icon={<DollarCircleOutlined className="sidebariconspecial" />}
            >
              <Link to="/admin/dashboard/salarymanagement">
                Salary Management
              </Link>
            </Menu.Item>

            <Menu.Item
              key="/admin/dashboard/settings"
              icon={<SettingOutlined className="sidebariconspecial" />}
            >
              <Link to="/admin/dashboard/settings">Settings</Link>
            </Menu.Item>

            <Menu.Item
              key="/admin/dashboard/termsandpolicies"
              icon={<FileProtectOutlined className="sidebariconspecial" />}
            >
              <Link to="/admin/dashboard/termsandpolicies">
                Terms & Policies
              </Link>
            </Menu.Item>
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
