import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Avatar,
  Button,
  DatePicker,
  message,
  Row,
  Col,
  Card,
} from "antd";
import {
  UserOutlined,
  FileSearchOutlined,
  FundOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import API from "../../utils/BaseURL";
import "../../styles/QCPoints.css";

const { Title, Text } = Typography;

const AllUsersQCPoints = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(moment());
  const [topUsers, setTopUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle Date Change (Year & Month)
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Fetch QC Points from backend
  const fetchMonthlyQC = async (dateValue = selectedDate) => {
    try {
      setLoading(true);
      const year = dateValue.format("YYYY");
      const month = dateValue.format("MM");

      const res = await API.get(
        `/qcpoints/monthly-summary?year=${year}&month=${month}`
      );
      setUsers(res.data.summary);
      setTopUsers(res.data.top5); // <- Update this inside your API response handler
    } catch (err) {
      console.error("Failed to fetch monthly QC data", err);
      message.error("Failed to load QC Points");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: (
        <>
          <UserOutlined style={{ marginRight: 6 }} />
          User
        </>
      ),
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
      title: (
        <>
          <FundOutlined style={{ marginRight: 6 }} />
          Total QC Points
        </>
      ),
      dataIndex: "totalPoints",
      key: "totalPoints",
      render: (points) => <Text strong>{points}</Text>,
    },
    {
      title: (
        <>
          <FileSearchOutlined style={{ marginRight: 6 }} />
          View QC Points
        </>
      ),
      key: "actions",
      render: (_, record) => {
        console.log(record);
        return (
          <Button
            type="primary"
            style={{ color: "white", backgroundColor: "#003c2f" }}
            onClick={() =>
              navigate(
                `/admin/dashboard/qcpoints/user/${
                  record.name
                }?date=${selectedDate.format("YYYY-MM")}`
              )
            }
          >
            View Details
          </Button>
        );
      },
    },
  ];
  useEffect(() => {
    fetchMonthlyQC(selectedDate);
  }, []);

  return (
    <div className="qcpoints-container">
      <div className="date-filter">
        <Text style={{ marginRight: "10px", color: "black" }}>
          Select Year & Month:
        </Text>
        <DatePicker
          picker="month"
          value={selectedDate}
          onChange={handleDateChange}
          className="calendar-picker"
          disabledDate={(current) =>
            current && current > moment().endOf("month")
          }
        />
      </div>
      <br />
      {topUsers.length > 0 && (
        <>
          <Title style={{ color: "black" }} level={3}>
            🏆 Top 5 Performers of the Month
          </Title>
          <Row gutter={[16, 16]}>
            {topUsers.map((user, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
                <Card className="top-performer-card" bordered hoverable>
                  <div style={{ textAlign: "center" }}>
                    <Avatar
                      size={64}
                      src={user.avatar}
                      icon={<UserOutlined />}
                      style={{ marginBottom: 10 }}
                    />
                    <Title level={5} style={{ margin: 0 }}>
                      {user.name}
                    </Title>
                    <Text type="secondary">QC Points: {user.totalPoints}</Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <br />
        </>
      )}
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 50 }}
        bordered
        className="qupointsAddTable"
      />
    </div>
  );
};

export default AllUsersQCPoints;
