import React, { useState, useEffect } from "react";
import { Table, Typography, Avatar, DatePicker, Tag } from "antd";
import { UserOutlined, ClockCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import "../../styles/Attendance.css";
import { useNavigate } from "react-router-dom";
import API from "../../utils/BaseURL";

const { Title, Text } = Typography;

const AllUsersAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [users, setUsers] = useState([]);

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

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await API.get("/attendance/all-agents"); // 🆕 Axios and updated endpoint
        const data = res.data;

        const formatted = data.map((item, index) => ({
          id: index + 1,
          name: item.username,
          avatar: `https://i.pravatar.cc/50?u=${item.username}`,
          attendance: {
            today: {
              checkIn: item.checkInTime
                ? moment(item.checkInTime).format("hh:mm A")
                : "",
              status: item.status,
            },
            month: {
              present: item.present || 0,
              absent: item.absent || 0,
              late: item.late || 0,
              total: item.total || 30,
            },
          },
        }));

        setUsers(formatted);
      } catch (error) {
        console.error("Failed to fetch attendance", error);
      }
    };

    fetchAttendance();
  }, []);

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
        dataSource={users}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
        className="attendance-table"
      />
    </div>
  );
};

export default AllUsersAttendance;
