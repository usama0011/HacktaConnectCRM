import "../styles/AdminRegisterProxyStats.css";
import React, { useEffect, useState } from "react";
import { Table, Tag, Avatar } from "antd";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import axios from "axios";
import {
  UserOutlined,
  IdcardOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  BankOutlined,
} from "@ant-design/icons";
import API from "../utils/BaseURL";

const COLORS = ["#28a745", "#ffc107", "#ff7043"]; // green, yellow, orange
const AdminRegisterProxyStats = () => {
  const [users, setUsers] = useState([]);
  const [shiftStats, setShiftStats] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await API.get("/auth/users");

      // Sort users by creation date (latest first)
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // ✅ Take only latest 5 users
      const latestFive = sorted.slice(0, 5);
      setUsers(latestFive);

      // Calculate shift stats from only these 5 users
      const shiftCounts = latestFive.reduce((acc, user) => {
        acc[user.shift] = (acc[user.shift] || 0) + 1;
        return acc;
      }, {});

      const stats = Object.entries(shiftCounts).map(([name, value]) => ({
        name,
        value,
      }));
      setShiftStats(stats);
    };

    fetchUsers();
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
            : "purple";
        return <Tag color={color}>{shift}</Tag>;
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

  return (
    <div className="CRM-stats-orders-wrapper">
      <div className="CRM-statistics-card">
        <h2>
          Statistics <span className="CRM-more-link">More ➔</span>
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={shiftStats}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {shiftStats.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            {/* ✅ Hover interaction */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                fontSize: "13px",
                borderRadius: "8px",
              }}
              formatter={(value, name, props) => [
                `${value} Users`,
                name.toUpperCase(),
              ]}
            />
          </PieChart>
        </ResponsiveContainer>

        <ul className="CRM-legend">
          {shiftStats.map((s, i) => (
            <li key={i}>
              <span
                className={`CRM-dot CRM-${s.name
                  .replace(" ", "")
                  .toLowerCase()}`}
              />
              {s.name.toUpperCase()} — {s.value}
            </li>
          ))}
        </ul>
      </div>

      <div className="CRM-orders-card">
        <h2>
          Users List <span className="CRM-more-link">More ➔</span>
        </h2>
        <Table
          className="CRM-orders-table"
          columns={columns}
          dataSource={users}
          rowKey="_id"
          pagination={false}
        />
      </div>
    </div>
  );
};

export default AdminRegisterProxyStats;
