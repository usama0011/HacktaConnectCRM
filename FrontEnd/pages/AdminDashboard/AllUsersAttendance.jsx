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
  Input,
} from "antd";
import {
  EnvironmentOutlined,
  StarFilled,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs"; // or use moment if preferred
import { Calendar } from "primereact/calendar";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // or any other theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import moment from "moment";
import "../../styles/Attendance.css";
import { useNavigate } from "react-router-dom";
import API from "../../utils/BaseURL"; // Make sure this is correctly set

const { Title, Text } = Typography;
import { Select } from "antd";
import { useUserContext } from "../../context/UserContext";

const AllUsersAttendance = () => {
  const { user } = useUserContext(); // ✅ Get current user
  const isRestrictedRole = ["Team Lead", "Team Lead WFH", "QC"].includes(
    user?.role
  );

  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const [attendanceData, setAttendanceData] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    shift: "",
    agentType: "",
    branch: "",
      agentName: "",

  });
  const navigate = useNavigate();
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
useEffect(() => {
  const date = dayjs(selectedDate).startOf("month");
  fetchAttendanceData(date);
}, [selectedDate]);


  const fetchAttendanceData = async (month) => {
    try {
      setLoading(true);
      const res = await API.get("/attendance/all", {
        params: {
          date: month.toISOString(),
          shift: filters.shift || undefined,
          agentType: filters.agentType || undefined,
          branch: filters.branch || undefined,
         agentName: filters.agentName || undefined,

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
        <Calendar
          value={new Date(selectedDate)}
          onChange={(e) => {
            const selected = e.value;
            const formatted = dayjs(selected).format("YYYY-MM-DD");
            setSelectedDate(formatted);
          }}
          dateFormat="yy-mm-dd"
          showIcon
          className="p-calendar-custom"
        />

        <div className="attendance-current-date">
          📅 {dayjs().format("dddd D MMMM YYYY")}
        </div>
      </div>

      <div
        style={{ marginTop: 16, display: "flex", gap: 16, flexWrap: "wrap" }}
      >
        {!isRestrictedRole && (
          <>
            <Select
              placeholder="Please select Shift"
              value={filters.shift || undefined}
              style={{ width: 180 }}
              onChange={(value) => handleFilterChange("shift", value)}
              allowClear
            >
              <Option disabled value="">
                Please select Shift
              </Option>
              <Option value="morning">Morning</Option>
              <Option value="evening">Evening</Option>
              <Option value="night">Night</Option>
            </Select>

            <Select
              placeholder="Please select Branch"
              value={filters.branch || undefined}
              style={{ width: 180 }}
              onChange={(value) => handleFilterChange("branch", value)}
              allowClear
            >
              <Option disabled value="">
                Please select Branch
              </Option>
              <Option value="Branch A">Branch A</Option>
              <Option value="Branch B">Branch B</Option>
            </Select>
          </>
        )}

        <Select
          placeholder="Please select Agent Type"
          value={filters.agentType || undefined}
          style={{ width: 180 }}
          onChange={(value) => handleFilterChange("agentType", value)}
          allowClear
        >
          <Option disabled value="">
            Please select Agent Type
          </Option>
          <Option value="Office Agent">Office Agent</Option>
          <Option value="WFH Agent">WFH Agent</Option>
        </Select>

      <Input
  placeholder="Search by Agent Name"
  value={filters.agentName}
  onChange={(e) => handleFilterChange("agentName", e.target.value)}
  style={{ width: 200, borderRadius: "10px" }}
  allowClear
/>

       <Button
  type="primary"
  onClick={() =>
    fetchAttendanceData(dayjs(selectedDate).startOf("month"))
  }
>
  Apply Filters
</Button>

        <Button
  onClick={() => {
    setFilters({
      shift: "",
      agentType: "",
      branch: "",
      agentName: "",
    });
    fetchAttendanceData(dayjs(selectedDate).startOf("month"));
  }}
>
  Reset Filters
</Button>

      </div>

      {/* Top Performers Section */}
      <div className="top-performers-container">
        <Title level={3} className="top-performers-title">
          <br />
          🏆 Top 3 Attendance Performers
        </Title>
        <br />
        <div className="top-performer-row-wrapper">
          <Row gutter={[16, 16]} justify="center">
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
      </div>

      <Spin spinning={loading}>
        <div className="attendance-table-wrapper">
          <Table
            columns={columns}
            dataSource={attendanceData}
            rowKey="id"
            pagination={{
  defaultPageSize: 50,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50", "100"],
}}

            bordered
            className="attendance-table"
          />
        </div>
      </Spin>
    </div>
  );
};

export default AllUsersAttendance;
