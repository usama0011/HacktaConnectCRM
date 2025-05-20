import React, { useEffect, useState } from "react";
import { Table, Typography, Avatar, DatePicker, message } from "antd";

import {
  CalendarOutlined,
  ClockCircleOutlined,
  ProfileOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  SmileOutlined,
  StarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useParams, useLocation } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import "../../styles/QCPoints.css";

const { Title, Text } = Typography;

const SingleUserQCPoints = () => {
  const { userId } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const dateParam = query.get("date");

  const [selectedDate, setSelectedDate] = useState(
    dateParam ? moment(dateParam, "YYYY-MM") : moment()
  );
  const [userData, setUserData] = useState({
    name: "",
    avatar: "",
    points: [],
  });

  const fetchUserQC = async () => {
    try {
      const year = selectedDate.format("YYYY");
      const month = selectedDate.format("MM");

      const res = await axios.get(
        `http://localhost:5000/api/qcpoints/user/${userId}?year=${year}&month=${month}`
      );
      setUserData(res.data);
    } catch (err) {
      console.error("Failed to fetch user QC points", err);
      message.error("Error loading user QC data.");
    }
  };

  useEffect(() => {
    fetchUserQC();
  }, [selectedDate]);

  const columns = [
    {
      title: (
        <>
          <CalendarOutlined /> Date
        </>
      ),
      dataIndex: "date",
      key: "date",
    },
    {
      title: (
        <>
          <ClockCircleOutlined /> Time
        </>
      ),
      dataIndex: "time",
      key: "time",
    },
    {
      title: (
        <>
          <ProfileOutlined /> Profile Pattern
        </>
      ),
      dataIndex: "profilePattern",
      key: "profilePattern",
    },
    {
      title: (
        <>
          <ThunderboltOutlined /> Pace Per Hour
        </>
      ),
      dataIndex: "pacePerHour",
      key: "pacePerHour",
    },
    {
      title: (
        <>
          <BarChartOutlined /> Per Hour Report
        </>
      ),
      dataIndex: "perHourReport",
      key: "perHourReport",
    },
    {
      title: (
        <>
          <SmileOutlined /> Working Behavior
        </>
      ),
      dataIndex: "workingBehavior",
      key: "workingBehavior",
    },
    {
      title: (
        <>
          <StarOutlined /> Total Points
        </>
      ),
      dataIndex: "totalPoints",
      key: "totalPoints",
      render: (points) => <Text strong>{points}</Text>,
    },
  ];

  return (
    <div className="qcpoints-container">
      <Title level={2} className="qcpoints-title">
        User QC Points Breakdown
      </Title>

      <div className="user-info">
        <Avatar src={userData.avatar} size={64} icon={<UserOutlined />} />
        <Title level={4} className="user-name">
          {userData.name}
        </Title>
      </div>

      <br />
     <input
  type="month"
  className="simple-calendar"
  value={selectedDate.format("YYYY-MM")}
  onChange={(e) => setSelectedDate(moment(e.target.value, "YYYY-MM"))}
/>

      <br />
      <br />
      <Table
        className="qupointsAddTable"
        columns={columns}
        dataSource={userData.points}
        rowKey="date"
                scroll={{ x: "max-content" }} // ✅ Enables horizontal scroll

        pagination={{ pageSize: 5 }}
        bordered
        summary={() => {
          const total = userData.points.reduce(
            (acc, row) => acc + row.totalPoints,
            0
          );
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={6}>
                <Text strong>Total QC Points for the Month</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Text strong>{total}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    </div>
  );
};

export default SingleUserQCPoints;
