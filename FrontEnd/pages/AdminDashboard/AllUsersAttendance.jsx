import React, { useState } from "react";
import { Table, Typography, Avatar, DatePicker, Button } from "antd";
import { UserOutlined, FolderOpenOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "../../styles/Attendance.css";

const { Title, Text } = Typography;

// Dummy User Data with Attendance Folders (Month-wise)
const dummyUsers = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://i.pravatar.cc/50?u=johndoe",
    attendanceMonths: ["2024-03", "2024-02", "2024-01"],
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/50?u=janesmith",
    attendanceMonths: ["2024-03", "2024-02"],
  },
];

const AllUsersAttendance = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(moment());

  // Handle Date Change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Extract Year & Month from selectedDate
  const selectedYear = selectedDate.format("YYYY");
  const selectedMonth = selectedDate.format("MM");

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
      title: "Attendance Records",
      key: "attendance",
      render: (_, record) => (
        <div className="attendance-folders">
          {record.attendanceMonths.map((month) => {
            const [year, monthNum] = month.split("-"); // Extract Year & Month
            return (
              <Button
                key={month}
                type="dashed"
                icon={<FolderOpenOutlined />}
                onClick={() =>
                  navigate(
                    `/admin/dashboard/attendance/user/${record.id}/${year}/${monthNum}`
                  )
                }
              >
                {moment(month, "YYYY-MM").format("MMMM YYYY")}
              </Button>
            );
          })}
        </div>
      ),
    },
  ];

  return (
    <div className="attendance-container">
      <Title level={2} className="attendance-title">
        All Users Attendance
      </Title>

      {/* Date Picker to Select Year & Month */}
      <DatePicker
        picker="month"
        value={selectedDate}
        onChange={handleDateChange}
        className="date-filter"
      />

      {/* Attendance Table */}
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

export default AllUsersAttendance;
