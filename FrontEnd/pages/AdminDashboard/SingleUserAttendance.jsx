import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Card,
  Row,
  Col,
  Table,
  Tag,
  message,
  Spin,
  Avatar,
} from "antd";
import moment from "moment";
import API from "../../utils/BaseURL";
import "../../styles/SingleUserAttandance.css";
import { Calendar } from "primereact/calendar";
import { Pie } from "@ant-design/plots";

const { Title, Text } = Typography;

const SingleUserAttendance = () => {
  const { username } = useParams();
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [userData, setUserData] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserAttendance(username, selectedMonth);
  }, [username, selectedMonth]);

  const fetchUserAttendance = async (username, month) => {
    try {
      setLoading(true);
      const res = await API.get(`/attendance/user/${username}`, {
        params: { date: month.startOf("month").toISOString() },
      });
      setUserData(res.data.user);
      setStats(res.data.stats);
      setAttendanceData(res.data.attendanceData);
    } catch (error) {
      console.error("Failed to fetch user attendance:", error);
      message.error("Failed to fetch user attendance.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "📅 Date",
      dataIndex: "date",
      key: "date",
      render: (date) => <Text>{moment(date).format("YYYY-MM-DD")}</Text>,
    },
    {
      title: "🕒 Check-in Time",
      dataIndex: "checkInTime",
      key: "checkInTime",
    },
    {
      title: "🕒 Check-out Time",
      dataIndex: "checkOutTime",
      key: "checkOutTime",
    },
    {
      title: "✅ Status",
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
  ];

  const pieChartData = stats.total
    ? [
        { type: "Present", value: stats.present },
        { type: "Absent", value: stats.absent },
        { type: "Late", value: stats.late },
        { type: "Leave", value: stats.leave },
        { type: "Rotation Off", value: stats.rotationOff },
      ]
    : [];

  const pieConfig = {
    appendPadding: 10,
    data: pieChartData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    height: window.innerWidth <= 480 ? 240 : 300,
    scale: {
      color: {
        range: [
          "#003c2f", // Dark Green (Present)
          "#005c47", // Medium-dark Green (Absent)
          "#007f5c", // Medium Green (Late)
          "#00a375", // Lighter Green (Leave)
          "#00c694", // Lightest Green (RotationOff)
        ],
      },
    },

    label: {
      text: (d) => `${d.type}: ${d.value} days`,
      position: "spider",
      style: {
        fontSize: 14,
        fontWeight: 500,
        fill: "#333",
      },
    },

    legend: {
      position: "right",
      itemSpacing: 5,
    },
    tooltip: {
      formatter: (datum) => ({
        name: datum?.type || "Unknown",
        value: `${datum?.value ?? 0} days`,
      }),
    },
    interactions: [{ type: "element-active" }],
  };
  console.log(stats);
  return (
    <div className="single-user-attendance-container">
      <div className="attendance-user-header">
        <Avatar src={userData?.avatar} size={45} />
        <span style={{ marginLeft: "10px" }}>{userData?.name}</span>
        <br />
        <br />
        <Title style={{ textAlign: "center" }} level={3}>
          Attendance Overview
        </Title>
        <div className="attendance-header">
          <Calendar
            value={selectedMonth.toDate()}
            onChange={(e) => setSelectedMonth(moment(e.value))}
            view="month"
            dateFormat="yy-mm"
            showIcon
            className="custom-month-picker"
          />
        </div>
      </div>
      <br />
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {Object.entries(stats)
            .filter(([key]) => key !== "total")
            .map(([key, value]) => (
              <Col xs={12} sm={8} md={4} key={key}>
                <Card className="attendance-stat-cardnewon">
                  <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                  <p>{value}</p>
                </Card>
              </Col>
            ))}
        </Row>
        <Table
          columns={columns}
          dataSource={attendanceData}
          rowKey="date"
          pagination={{ pageSize: 32 }}
          className="user-attendance-table"
          style={{ marginTop: 20 }}
          scroll={{ x: "max-content" }}
        />
      </Spin>
      <Card>
        <div style={{ marginTop: 40 }}>
          {pieChartData.length > 0 ? (
            <Pie {...pieConfig} />
          ) : (
            <Spin tip="Loading Chart..." />
          )}
        </div>
      </Card>
    </div>
  );
};

export default SingleUserAttendance;
