import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Typography, Avatar, Tag } from "antd";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import moment from "moment";
import "../../styles/Attendance.css"; // Use your existing CSS!

const { Title, Text } = Typography;

const SingleAgentAttendance = () => {
  const { id } = useParams(); // 🆕 get userId from URL
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment()); // current month default

  useEffect(() => {
    // Dummy data (normally this will be fetched from backend)
    const dummyAttendance = [
      {
        date: "2025-04-01",
        status: "Present",
        checkInTime: "09:00 AM",
      },
      {
        date: "2025-04-02",
        status: "Present",
        checkInTime: "09:10 AM",
      },
      {
        date: "2025-04-03",
        status: "Absent",
        checkInTime: null,
      },
      {
        date: "2025-04-04",
        status: "Late",
        checkInTime: "10:05 AM",
      },
      {
        date: "2025-04-05",
        status: "Leave",
        checkInTime: null,
      },
      {
        date: "2025-04-06",
        status: "RotationOff",
        checkInTime: null,
      },
      // Add more days of month dummy if you want
    ];

    setAttendanceData(dummyAttendance);
  }, [id]);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <div>
          <CalendarOutlined style={{ marginRight: 8 }} />
          {moment(date).format("DD MMMM YYYY")}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "Present") color = "green";
        else if (status === "Late") color = "orange";
        else if (status === "Absent") color = "red";
        else if (status === "Leave") color = "purple";
        else if (status === "RotationOff") color = "blue";

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Check-In Time",
      dataIndex: "checkInTime",
      key: "checkInTime",
      render: (time) => (time ? time : "—"),
    },
  ];

  return (
    <div className="attendance-container">
      <Title level={2} className="attendance-title">
        📋 Attendance Report
      </Title>

      <div className="attendance-header">
        <Text strong style={{ fontSize: "16px" }}>
          Month: {selectedMonth.format("MMMM YYYY")}
        </Text>
        <Text strong style={{ fontSize: "16px" }}>
          👤 User ID: {id}
        </Text>
      </div>

      <Table
        columns={columns}
        dataSource={attendanceData}
        rowKey="date"
        pagination={false}
        bordered
        className="attendance-table"
      />
    </div>
  );
};

export default SingleAgentAttendance;
