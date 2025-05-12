import "../styles/AdminRegisterProxyStats.css";
import React, { useEffect, useState } from "react";
import { Table, Tag, Avatar, Skeleton, message } from "antd";
import { Pie } from "@ant-design/plots";
import {
  UserOutlined,
  IdcardOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  BankOutlined,
} from "@ant-design/icons";
import API from "../utils/BaseURL";

const AdminRegisterProxyStats = () => {
  const [users, setUsers] = useState([]);
  const [shiftStats, setShiftStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        
        // ✅ Fetch user list
        const { data: userData } = await API.get("/auth/management");
        console.log("Fetched Users:", userData);
        setUsers(userData);

        // ✅ Fetch shift statistics directly from API
        const { data: shiftData } = await API.get("/auth/agents/shift-count");
        console.log("Fetched Shift Stats:", shiftData);

        // ✅ Transform API response for chart
        const stats = Object.entries(shiftData.shiftCounts).map(
          ([type, value]) => ({
            type: type.charAt(0).toUpperCase() + type.slice(1),
            value,
          })
        );

        setShiftStats(stats);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        message.error("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const columns = [
    {
      title: (
        <>
          <UserOutlined style={{ marginRight: 6 }} />
          User
        </>
      ),
      dataIndex: "username",
      key: "username",
      render: (_, record) => (
        <div className="CRM-user-info">
          <Avatar src={record.userImage} icon={<UserOutlined />} />
          <span style={{ textTransform: "capitalize" }}>{record.username}</span>
        </div>
      ),
    },
    {
      title: (
        <>
          <IdcardOutlined style={{ marginRight: 6 }} />
          Role
        </>
      ),
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: (
        <>
          <ClockCircleOutlined style={{ marginRight: 6 }} />
          Shift
        </>
      ),
      dataIndex: "shift",
      key: "shift",
      render: (shift) => {
        const color =
          shift === "morning"
            ? "green"
            : shift === "evening"
            ? "orange"
            : shift === "night"
            ? "red"
            : "gray";
        return <Tag color={color}>{shift || "Unknown"}</Tag>;
      },
    },
    {
      title: (
        <>
          <BankOutlined style={{ marginRight: 6 }} />
          Bank
        </>
      ),
      dataIndex: "bankName",
      key: "bankName",
      render: (bank) => bank || "N/A",
    },
    {
      title: (
        <>
          <CalendarOutlined style={{ marginRight: 6 }} />
          Registered
        </>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

// Ant Design Pie Chart Configuration
const pieConfig = {
  appendPadding: 10,
  data: shiftStats,
  angleField: "value",
  colorField: "type",
  radius: 0.75,
  innerRadius: 0.6,
  height: 350,
  color: ["#1890ff", "#37c661", "#fbce1e", "#2b3b79", "#8a4be2", "#1dc5c5"],
  label: {
    type: "outer",
    formatter: (data) => {
      if (!data || !data.type) return "";
      return `${data.type}: ${data.value}`;
    },
    style: {
      fontSize: 14,
      fontWeight: 500,
    },
  },
  legend: {
    position: "right",
    itemName: {
      formatter: (text, item) => {
        return `${item.value}: ${shiftStats.find(s => s.type === item.value)?.value || 0}`;
      },
    },
  },
  tooltip: {
    formatter: (datum) => {
      if (!datum || !datum.type) return { name: "Unknown", value: "0" };
      return {
        name: datum.type,
        value: `${datum.value} Agents`,
      };
    },
  },
  interactions: [{ type: "element-active" }],
};


  return (
    <div className="CRM-stats-orders-wrapper">
      <div className="CRM-statistics-card donatgraphcharforme">
        <h2>Statistics <span className="CRM-more-link">More ➔</span></h2>
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : shiftStats.length > 0 ? (
          <Pie {...pieConfig} />
        ) : (
          <p>No shift data available.</p>
        )}
      </div>

      <div className="CRM-orders-card">
        <h2>Users List <span className="CRM-more-link">More ➔</span></h2>
        {loading ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : (
          <Table
            className="CRM-orders-table"
            columns={columns}
            dataSource={users}
            rowKey="_id"
            pagination={false}
          />
        )}
      </div>
    </div>
  );
};

export default AdminRegisterProxyStats;
