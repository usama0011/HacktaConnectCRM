import React, { useState } from "react";
import { Table, Card, Typography, DatePicker, Button } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Title, Text } = Typography;

const ReportsGenerate = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(moment());

  // Dummy Reports Data
  const dummyReports = [
    {
      key: "1",
      userId: "001",
      username: "John Doe",
      role: "Developer",
      shift: "Morning",
      totalClicks: 150,
      totalQCPoints: 150,
      totalSessions: 20,
      totalCount: 170,
      totalSalary: "$3000",
      attendanceStatus: "Present",
      loginTime: "09:00 AM",
      logoutTime: "06:00 PM",
    },
    {
      key: "2",
      userId: "002",
      username: "Jane Smith",
      role: "Designer",
      shift: "Evening",
      totalClicks: 120,
      totalSessions: 15,
      totalQCPoints: 15,
      totalCount: 135,
      totalSalary: "$2800",
      attendanceStatus: "Present",
      loginTime: "02:00 PM",
      logoutTime: "10:00 PM",
    },
    {
      key: "3",
      userId: "003",
      username: "Emily Johnson",
      role: "QA Engineer",
      shift: "Night",
      totalClicks: 90,
      totalQCPoints: 90,
      totalSessions: 10,
      totalCount: 100,
      totalSalary: "$2600",
      attendanceStatus: "Absent",
      loginTime: "02:00 PM",
      logoutTime: "10:00 PM",
    },
  ];

  // Handle Date Change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log(`Fetching reports for: ${date.format("YYYY/MM/DD")}`);
    // Dummy log (API call will be added here later)
  };

  // Table Columns
  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() =>
            navigate(
              `/reports/user/${record.userId}/${selectedDate.format(
                "YYYY/MM/DD"
              )}`
            )
          }
        >
          {text}
        </Button>
      ),
    },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Shift", dataIndex: "shift", key: "shift" },
    { title: "Total Clicks", dataIndex: "totalClicks", key: "totalClicks" },
    {
      title: "Total Sessions",
      dataIndex: "totalSessions",
      key: "totalSessions",
    },
    { title: "Total Count", dataIndex: "totalCount", key: "totalCount" },
    {
      title: "Total QC Points",
      dataIndex: "totalQCPoints",
      key: "totalQCPoints",
    },
    { title: "Total Salary", dataIndex: "totalSalary", key: "totalSalary" },
  ];

  return (
    <div className="reports-container">
      <Card className="reports-card">
        <Title level={2}>Users Report</Title>
        <Text style={{ marginRight: "5px" }}>
          Select a date to filter records:
        </Text>
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          format="YYYY/MM/DD"
        />
        <br />
        <br />
        <Table
          columns={columns}
          dataSource={dummyReports}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default ReportsGenerate;
