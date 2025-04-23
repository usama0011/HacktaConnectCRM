import React, { useState, useEffect } from "react";
import { Table, Typography, Avatar, DatePicker, Tag } from "antd";
import { UserOutlined, ClockCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import "../../styles/Attendance.css";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const dummyUsers = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://i.pravatar.cc/50?u=johndoe",
    attendance: {
      today: { checkIn: "09:05 AM", status: "Present" },
      month: {
        present: 18,
        absent: 3,
        late: 2,
        total: 30,
      },
    },
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/50?u=janesmith",
    attendance: {
      today: { checkIn: "", status: "Absent" },
      month: {
        present: 15,
        absent: 10,
        late: 3,
        total: 30,
      },
    },
  },
];

const AllUsersAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const navigate = useNavigate();
  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div
          className="user-info clickable"
          onClick={() =>
            navigate(`/admin/dashboard/attendance/user/${record.name}`)
          }
        >
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <Text className="user-name">{text}</Text>
        </div>
      ),
    },

    {
      title: "Check-in Time",
      key: "checkIn",
      render: (record) => (
        <span className="check-in-time">
          <ClockCircleOutlined /> {record.attendance.today.checkIn || "—"}
        </span>
      ),
    },
    {
      title: "Today’s Status",
      key: "status",
      render: (record) => {
        const status = record.attendance.today.status;
        let color = "default";
        if (status === "Present") color = "green";
        if (status === "Late") color = "orange";
        if (status === "Absent") color = "red";

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Month Summary",
      key: "summary",
      render: (record) => {
        const { present, absent, late } = record.attendance.month;
        return (
          <div className="month-summary">
            <Tag color="green">Present: {present}</Tag>
            <Tag color="red">Absent: {absent}</Tag>
            <Tag color="orange">Late: {late}</Tag>
          </div>
        );
      },
    },
    {
      title: "Total Days",
      key: "total",
      render: (record) => <strong>{record.attendance.month.total}</strong>,
    },
  ];

  return (
    <div className="attendance-container">
      <Title level={2} className="attendance-title">
        📅 All Users Attendance
      </Title>

      <div className="attendance-header">
        <div></div> {/* empty div to push date to right side */}
        <div className="attendance-current-date">
          📅 {moment().format("dddd D MMMM YYYY")}
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={dummyUsers}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
        className="attendance-table"
      />
    </div>
  );
};

export default AllUsersAttendance;
