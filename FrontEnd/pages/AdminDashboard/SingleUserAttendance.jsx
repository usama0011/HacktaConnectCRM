import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Card,
  Row,
  Col,
  Table,
  DatePicker,
  Tag,
  Space,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "../../styles/SingleUserAttandance.css";
import PresentIcon from "../../src/assets/present.png";
import AbsentIcon from "../../src/assets/absent.png";
import totalDaysIcon from "../../src/assets/totaldays.png";
import LeaveIcon from "../../src/assets/leave.png";
import LateIcon from "../../src/assets/late.png";
import { Column } from "@ant-design/plots";

const { Title, Text } = Typography;

const dummyAttendanceData = [
  { date: "2025-04-01", status: "Present", checkIn: "09:03 AM" },
  { date: "2025-04-02", status: "Late", checkIn: "09:45 AM" },
  { date: "2025-04-03", status: "Absent", checkIn: "" },
  { date: "2025-04-04", status: "Present", checkIn: "09:01 AM" },
  { date: "2025-04-05", status: "Late", checkIn: "09:35 AM" },
  { date: "2025-04-06", status: "Present", checkIn: "09:00 AM" },
];

const SingleUserAttendance = () => {
  const { username } = useParams();
  const [selectedMonth, setSelectedMonth] = useState(moment());

  const stats = {
    present: dummyAttendanceData.filter((d) => d.status === "Present").length,
    absent: dummyAttendanceData.filter((d) => d.status === "Absent").length,
    late: dummyAttendanceData.filter((d) => d.status === "Late").length,
    total: dummyAttendanceData.length,
  };

  const statusColorMap = {
    Present: "green",
    Late: "orange",
    Absent: "red",
  };

  const statusIconMap = {
    Present: <CheckCircleOutlined />,
    Late: <ClockCircleOutlined />,
    Absent: <CloseCircleOutlined />,
  };

  const columns = [
    {
      title: "📅 Date",
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <Text>
          <CalendarOutlined style={{ marginRight: 6 }} />
          {moment(date).format("dddd, MMM D, YYYY")}
        </Text>
      ),
    },
    {
      title: "🕒 Check-in Time",
      dataIndex: "checkIn",
      key: "checkIn",
      render: (checkIn) =>
        checkIn ? (
          <Tag icon={<ClockCircleOutlined />} color="blue">
            {checkIn}
          </Tag>
        ) : (
          <Tag>—</Tag>
        ),
    },
    {
      title: "🕒 CheckOut Time",
      dataIndex: "checkIn",
      key: "checkIn",
      render: (checkIn) =>
        checkIn ? (
          <Tag icon={<ClockCircleOutlined />} color="blue">
            {checkIn}
          </Tag>
        ) : (
          <Tag>—</Tag>
        ),
    },
    {
      title: "✅ Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColorMap[status]} icon={statusIconMap[status]}>
          {status}
        </Tag>
      ),
    },
  ];
  const cards = [
    {
      label: "Present Days",
      value: stats.present,
      icon: <img src={PresentIcon} alt="" />,
    },
    {
      label: "Absent Days",
      value: stats.absent,
      icon: <img src={AbsentIcon} alt="" />,
    },
    {
      label: "Late Days",
      value: stats.late,
      icon: <img src={LateIcon} alt="" />,
    },

    {
      label: "Total Leaves",
      value: stats.total,
      icon: <img src={LeaveIcon} alt="" />,
    },
    {
      label: "Total Days",
      value: stats.total,
      icon: <img src={totalDaysIcon} alt="" />,
    },
  ];
  const attendanceGraphData = [
    { date: "Mar 01", hours: 6.71 },
    { date: "Mar 02", hours: 7.45 },
    { date: "Mar 03", hours: 5.04 },
    { date: "Mar 04", hours: 5.62 },
    { date: "Mar 05", hours: 7.44 },
    { date: "Mar 06", hours: 0 },
    { date: "Mar 07", hours: 8.21 },
    { date: "Mar 08", hours: 7.31 },
    { date: "Mar 09", hours: 6.9 },
    { date: "Mar 10", hours: 0 },
    { date: "Mar 11", hours: 8 },
    { date: "Mar 12", hours: 7.8 },
    { date: "Mar 13", hours: 6.5 },
    { date: "Mar 14", hours: 7.25 },
    { date: "Mar 15", hours: 0 },
  ];

  return (
    <div className="single-user-attendance-container">
      <div className="attendance-user-header">
        <div>
          <Title level={3}>
            <UserOutlined /> {username}'s Attendance Overview
          </Title>
          <Text type="secondary">
            A detailed breakdown of daily attendance and check-ins
          </Text>
        </div>
        <br />
        <DatePicker
          picker="month"
          value={selectedMonth}
          onChange={setSelectedMonth}
          className="attendance-month-picker"
        />
      </div>
      <br />
      <div className="attendance-summary-row-flex">
        {cards.map((card, idx) => (
          <Card className="summary-card-flex" key={idx}>
            <div className="summary-card-content">
              <div
                className="summary-icon"
                style={{ backgroundColor: card.color }}
              >
                {card.icon}
              </div>
              <div>
                <Text className="summary-label">{card.label}</Text>
                <Title level={3} className="summary-value">
                  {card.value}
                </Title>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="attendance-table-card">
        <Title level={4} style={{ marginBottom: 20 }}>
          📊 Daily Breakdown
        </Title>
        <Table
          columns={columns}
          dataSource={dummyAttendanceData}
          rowKey="date"
          pagination={{ pageSize: 10 }}
          className="user-attendance-table"
        />
      </Card>
      <br />
      <Card className="attendance-chart-card">
        <div className="attendance-chart-header">
          <span className="attendance-chart-title">
            📊 Monthly Working Hours
          </span>
        </div>
        <div style={{ height: 320 }}>
          <Column
            data={attendanceGraphData}
            xField="date"
            yField="hours"
            columnWidthRatio={0.6}
            xAxis={{
              label: { rotate: -45, style: { fontSize: 10 } },
            }}
            yAxis={{
              title: { text: "Hours Worked" },
              min: 0,
              max: 8,
            }}
            label={{
              position: "middle",
              style: {
                fill: "#fff",
                fontSize: 12,
              },
            }}
            style={{
              fill: "#003c2f",
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default SingleUserAttendance;
