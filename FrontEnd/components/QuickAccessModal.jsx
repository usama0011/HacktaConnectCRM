// components/QuickAccessModal.jsx
import React from "react";
import { Modal, List, Input } from "antd";
import {
  DashboardOutlined,
  BarChartOutlined,
  UserOutlined,
  CalendarOutlined,
  DotChartOutlined,
  DollarCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const quickLinks = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardOutlined style={{color:"#1e2d7d"}} />,
  },
  {
    title: "Proxy Usage",
    path: "/admin/dashboard/proxyusage",
    icon: <BarChartOutlined style={{color:"#1e2d7d"}}  />,
  },
  {
    title: "Manage Users",
    path: "/admin/dashboard/manageusers",
    icon: <UserOutlined style={{color:"#1e2d7d"}}  />,
  },
  {
    title: "Agents Attendance",
    path: "/admin/dashboard/allusersattandance",
    icon: <CalendarOutlined style={{color:"#1e2d7d"}}  />,
  },
  {
    title: "Agent Reports",
    path: "/admin/dashboard/ipreportsusers",
    icon: <DotChartOutlined style={{color:"#1e2d7d"}}  />,
  },
  {
    title: "Salary Management",
    path: "/admin/dashboard/salarymanagement",
    icon: <DollarCircleOutlined style={{color:"#1e2d7d"}}  />,
  },
  {
    title: "Settings",
    path: "/admin/dashboard/settings",
    icon: <SettingOutlined style={{color:"#1e2d7d"}}  />,
  },
];

const QuickAccessModal = ({
  visible,
  onClose,
  searchValue,
  setSearchValue,
}) => {
  const filtered = quickLinks.filter((item) =>
    item.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      title="Quick Access"
      centered
      className="quick-access-modal"
    >
      <Input
        placeholder="Type to search..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <List
        itemLayout="horizontal"
        dataSource={filtered}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={item.icon}
              title={
                <Link
                  to={item.path}
                  onClick={() => {
                    onClose(); // ✅ Close modal when link is clicked
                  }}
                >
                  {item.title}
                </Link>
              }
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default QuickAccessModal;
