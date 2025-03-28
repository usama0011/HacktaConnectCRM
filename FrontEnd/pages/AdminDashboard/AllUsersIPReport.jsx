import React, { useState } from "react";
import { Table, Avatar, Typography, DatePicker, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "../../styles/IPSubmission.css";

const { Title, Text } = Typography;

// Dummy Data
const dummyUsers = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://i.pravatar.cc/40?u=johndoe",
    totalClicks: 120,
    totalSessions: 90,
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/40?u=janesmith",
    totalClicks: 100,
    totalSessions: 80,
  },
  {
    id: 3,
    name: "Emily Johnson",
    avatar: "https://i.pravatar.cc/40?u=emily",
    totalClicks: 90,
    totalSessions: 75,
  },
  {
    id: 4,
    name: "Michael Brown",
    avatar: "https://i.pravatar.cc/40?u=michael",
    totalClicks: 140,
    totalSessions: 95,
  },
];

const AllUsersIPReport = () => {
  const navigate = useNavigate();

  // Table Columns
  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="user-info">
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <Text className="user-name">{text}</Text>
        </div>
      ),
    },
    {
      title: "Total Clicks",
      dataIndex: "totalClicks",
      key: "totalClicks",
      render: (clicks) => <Text>{clicks}</Text>,
    },
    {
      title: "Total Sessions",
      dataIndex: "totalSessions",
      key: "totalSessions",
      render: (sessions) => <Text>{sessions}</Text>,
    },
    {
      title: "Total IPs",
      dataIndex: "totalSessions",
      key: "totalSessions",
      render: (sessions) => <Text>{sessions}</Text>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() =>
            navigate(`/admin/dashboard/ipreport/user/${record.id}`)
          }
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="ipreport-container">
      <Title level={2} className="ipreport-title">
        All Users IP Submission Report
      </Title>
      <Table
        columns={columns}
        dataSource={dummyUsers}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default AllUsersIPReport;
