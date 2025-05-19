import React, { useState, useEffect } from "react";
import {
  Table,
  Typography,
  Avatar,
  DatePicker,
  Tag,
  Button,
  message,
  Tooltip,
  Spin,
  Card,
  Row,
  Col,
} from "antd";
import {
  EnvironmentOutlined,
  StarFilled,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs"; // or use moment if preferred

import moment from "moment";
import "../../styles/Attendance.css";
import { useNavigate } from "react-router-dom";
import API from "../../utils/BaseURL"; // Make sure this is correctly set

const { Title, Text } = Typography;
import { Select } from "antd";

const AllUsersAttendance = () => {
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const [attendanceData, setAttendanceData] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(false);
  // Inside your component
  const [filters, setFilters] = useState({
    shift: "",
    agentType: "",
    branch: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const date = dayjs(selectedDate).startOf("month");
    fetchAttendanceData(date);
  }, [selectedDate, filters]);

  const fetchAttendanceData = async (month) => {
    try {
      setLoading(true);
      const res = await API.get("/attendance/all", {
        params: {
          date: month.toISOString(), // ✅ sends same format as Ant Design
          shift: filters.shift || undefined,
          agentType: filters.agentType || undefined,
          branch: filters.branch || undefined,
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
        <input
          type="date"
          className="simple-calendar"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <div className="attendance-current-date">
          📅 {dayjs().format("dddd D MMMM YYYY")}
        </div>
      </div>

      {/* Filters UI */}
      <div
        style={{ margin: "20px 0", display: "flex", flexWrap: "wrap", gap: 16 }}
      >
        <Select
          placeholder="Select Shift"
          style={{ width: 180 }}
          value={filters.shift}
          onChange={(val) => setFilters({ ...filters, shift: val })}
          allowClear
        >
          <Select.Option value="">All Shifts</Select.Option>
          <Select.Option value="morning">Morning</Select.Option>
          <Select.Option value="evening">Evening</Select.Option>
          <Select.Option value="night">Night</Select.Option>
        </Select>

        <Select
          placeholder="Select Agent Type"
          style={{ width: 180 }}
          value={filters.agentType}
          onChange={(val) => setFilters({ ...filters, agentType: val })}
          allowClear
        >
          <Select.Option value="">All Types</Select.Option>
          <Select.Option value="Office Agent">Office Agent</Select.Option>
          <Select.Option value="WFH Agent">WFH Agent</Select.Option>
        </Select>

        <Select
          placeholder="Select Branch"
          style={{ width: 180 }}
          value={filters.branch}
          onChange={(val) => setFilters({ ...filters, branch: val })}
          allowClear
        >
          <Select.Option value="">All Branches</Select.Option>
          <Select.Option value="Branch A">Branch A</Select.Option>
          <Select.Option value="Branch B">Branch B</Select.Option>
        </Select>

        <Button
          type="primary"
          onClick={() =>
            fetchAttendanceData(dayjs(selectedDate).startOf("month"))
          }
        >
          Apply Filters
        </Button>
      </div>

      {/* Top Performers Section */}
      <div className="top-performers-container">
        <Title level={3} className="top-performers-title">
          <br />
          🏆 Top 5 Attendance Performers
        </Title>
        <br />
        <Row gutter={[16, 16]}>
          {topPerformers.map((performer, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card className="wave-card" bordered={false}>
                <div className="wave-bg" />
                <div className="wave-card-inner">
                  <Avatar
                    size={72}
                    src={performer.avatar}
                    className="avatar-ring"
                  />
                  <Text strong className="performer-name">
                    {performer.name}
                  </Text>
                  <div className="present-info">
                    <CalendarOutlined style={{ marginRight: 6 }} />
                    {performer.presentDays}/{performer.totalDays} Present
                  </div>
                  <div className="badge">#Best Performer {index + 1}</div>
                </div>
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
