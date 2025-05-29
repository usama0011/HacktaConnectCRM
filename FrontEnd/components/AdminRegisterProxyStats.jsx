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
        // ✅ Sort by creation date (latest first) and take only 5 users
        const latestUsers = userData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setUsers(latestUsers);

        // ✅ Fetch shift statistics directly from API
        const { data: shiftData } = await API.get("/auth/agents/shift-count");
        console.log(shiftData);
        // ✅ Transform API response for chart
        const stats = Object.entries(shiftData.shiftCounts)
          .filter(([type, value]) => type && value > 0)
          .map(([type, value]) => ({
            type: type.charAt(0).toUpperCase() + type.slice(1),
            value,
          }));

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
          <CalendarOutlined style={{ marginRight: 6 }} />
          Registered
        </>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  const pieConfig = {
    appendPadding: 10,
    data: shiftStats.filter((item) => item.type && item.value > 0),
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    height: 220,
    // ✅ Custom color scale
    scale: {
      color: {
        range: ["#1e2d7d", "#274e7b", "#1e2d4d", "#3b9f7e"],
      },
    },
    label: {
      text: (d) => `${d.type}\n${d.value} Agents`,
      position: "spider",
      style: {
        fontSize: 14,
        fontWeight: 500,
        fill: "#333", // darker text
      },
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
    tooltip: {
      formatter: (datum) => ({
        name: datum?.type || "Unknown",
        value: `${datum?.value ?? 0} Agents`,
      }),
    },
    interactions: [{ type: "element-active" }],
  };

  return (
    <div className="CRM-stats-orders-wrapper">
      <div className="CRM-statistics-card donatgraphcharforme">
        <h2>
          Statistics <span className="CRM-more-link">More ➔</span>
        </h2>
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : shiftStats.length > 0 ? (
          <Pie {...pieConfig} />
        ) : (
          <p>No shift data available.</p>
        )}
      </div>

      <div className="CRM-orders-card">
        <h2>
          Management List <span className="CRM-more-link">More ➔</span>
        </h2>
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
