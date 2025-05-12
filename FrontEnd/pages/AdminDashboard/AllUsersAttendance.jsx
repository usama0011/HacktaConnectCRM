import React, { useState, useEffect } from "react";
import { Table, Typography, Avatar, DatePicker, Tag, Button, message, Spin, Card, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import moment from "moment";
import "../../styles/Attendance.css";
import { useNavigate } from "react-router-dom";
import API from "../../utils/BaseURL"; // Make sure this is correctly set

const { Title, Text } = Typography;

const AllUsersAttendance = () => {
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [attendanceData, setAttendanceData] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch attendance data when the component loads or when the month changes
    fetchAttendanceData(selectedMonth);
  }, [selectedMonth]);

  // ✅ Function to fetch attendance data from the backend
  const fetchAttendanceData = async (month) => {
    try {
      setLoading(true);
      const res = await API.get("/attendance/all", {
        params: {
          date: month.startOf("month").toISOString(),
        },
      });
      setAttendanceData(res.data.attendanceData);
      setTopPerformers(res.data.topPerformers);
    } catch (error) {
      console.error("Failed to fetch attendance data:", error);
      message.error("Failed to fetch attendance data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

      {/* Top Performers Section */}
      <div className="top-performers-container">
        <Title level={3} className="top-performers-title">🏆 Top 5 Attendance Performers</Title>
        <Row gutter={[16, 16]}>
          {topPerformers.map((performer, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card className="top-performer-card">
                <Avatar src={performer.avatar} size={64} className="performer-avatar" />
                <Text className="performer-name">{performer.name}</Text>
                <Text className="performer-stats">
                  Present: {performer.presentDays} / {performer.totalDays} days
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={attendanceData}
          rowKey="id"
          pagination={{ pageSize: 50 }}
          bordered
          className="attendance-table"
        />
      </Spin>
    </div>
  );
};

export default AllUsersAttendance;
