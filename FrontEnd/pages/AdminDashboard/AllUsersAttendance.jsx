import React, { useState } from "react";
import { Table, Typography, Avatar, DatePicker, Tag, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import moment from "moment";
import "../../styles/Attendance.css";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const AllUsersAttendance = () => {
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const navigate = useNavigate();

  const columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user) => (
        <div className="user-info">
          <Avatar src={user.avatar} icon={<UserOutlined />} />
          <Text className="user-name">{user.name}</Text>
        </div>
      ),
    },
    {
      title: "Today's Status",
      dataIndex: "todayStatus",
      key: "todayStatus",
      render: (status) => {
        let color = "default";
        if (status === "Present") color = "green";
        else if (status === "Late") color = "orange";
        else if (status === "Absent") color = "red";
        else if (status === "RotationOff") color = "blue";
        else if (status === "Leave") color = "purple";

        return <Tag color={color}>{status || "Pending"}</Tag>;
      },
    },
    {
      title: "Month Summary",
      dataIndex: "monthSummary",
      key: "monthSummary",
      render: (summary) => (
        <div className="month-summary">
          <Tag color="green">Present: {summary.present}</Tag>
          <Tag color="red">Absent: {summary.absent}</Tag>
          <Tag color="orange">Late: {summary.late}</Tag>
          <Tag color="purple">Leave: {summary.leave}</Tag>
          <Tag color="blue">Rotation Off: {summary.rotationOff}</Tag>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <Button
          type="primary"
          className="view-button"
          onClick={() =>
            navigate(`/admin/dashboard/attendance/user/${record.id}`)
          }
        >
          View Report
        </Button>
      ),
    },
  ];

  // Temporary dummy data
  const dummyData = [
    {
      id: "user1",
      user: { name: "Usama", avatar: "https://i.pravatar.cc/50?u=usama" },
      todayStatus: "Present",
      monthSummary: {
        present: 20,
        absent: 5,
        late: 2,
        leave: 1,
        rotationOff: 2,
      },
    },
    {
      id: "user2",
      user: { name: "Ali", avatar: "https://i.pravatar.cc/50?u=ali" },
      todayStatus: "Late",
      monthSummary: {
        present: 18,
        absent: 7,
        late: 3,
        leave: 1,
        rotationOff: 1,
      },
    },
  ];

  return (
    <div className="attendance-container">
      <Title level={2} className="attendance-title">
        📅 All Users Attendance
      </Title>

      <div className="attendance-header">
        <DatePicker
          picker="month"
          value={selectedMonth}
          onChange={(value) => setSelectedMonth(value)}
          format="MMMM YYYY"
          allowClear={false}
        />
        <div className="attendance-current-date">
          📅 {moment().format("dddd D MMMM YYYY")}
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={dummyData}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
        className="attendance-table"
      />
    </div>
  );
};

export default AllUsersAttendance;
