import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Card,
  Row,
  Col,
  Table,
  DatePicker,
  Tag,
  message,
  Spin,
  Avatar,
} from "antd";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import moment from "moment";
import API from "../../utils/BaseURL";

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

  return (
    <div className="single-user-attendance-container">
      <div className="attendance-user-header">
        <Avatar src={userData?.avatar} size={64} />
        <Title level={3}>{userData?.name}'s Attendance Overview</Title>
        <input
          type="date"
          className="simple-calendar"
          value={selectedMonth.format("YYYY-MM-DD")}
          onChange={(e) => setSelectedMonth(moment(e.target.value))}
        />
      </div>
      <br />
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {Object.keys(stats).map((key) => (
            <Col xs={12} sm={8} md={4} key={key}>
              <Card className="attendance-stat-card">
                <Title level={4}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Title>
                <Text>{stats[key]}</Text>
              </Card>
            </Col>
          ))}
        </Row>

        <Table
          columns={columns}
          dataSource={attendanceData}
          rowKey="date"
          pagination={{ pageSize: 10 }}
          className="user-attendance-table"
          style={{ marginTop: 20 }}
        />
      </Spin>
    </div>
  );
};

export default SingleUserAttendance;
