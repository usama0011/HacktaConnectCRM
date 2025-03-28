import React, { useState } from "react";
import { Table, Typography, Avatar, DatePicker } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import moment from "moment";
import "../../styles/QCPoints.css";

const { Title, Text } = Typography;

// Dummy QC Points Data (Date-wise with Breakdown)
const dummyData = {
  1: {
    name: "John Doe",
    avatar: "https://i.pravatar.cc/50?u=johndoe",
    points: [
      {
        date: "2024-03-01",
        time: 2,
        profilePattern: 3,
        pacePerHour: 2,
        perHourReport: 1,
        workingBehavior: 2,
      },
      {
        date: "2024-03-02",
        time: 3,
        profilePattern: 2,
        pacePerHour: 3,
        perHourReport: 2,
        workingBehavior: 2,
      },
      {
        date: "2024-03-03",
        time: 1,
        profilePattern: 3,
        pacePerHour: 2,
        perHourReport: 3,
        workingBehavior: 2,
      },
    ],
  },
  2: {
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/50?u=janesmith",
    points: [
      {
        date: "2024-03-01",
        time: 3,
        profilePattern: 3,
        pacePerHour: 3,
        perHourReport: 3,
        workingBehavior: 3,
      },
      {
        date: "2024-03-02",
        time: 4,
        profilePattern: 2,
        pacePerHour: 3,
        perHourReport: 2,
        workingBehavior: 2,
      },
      {
        date: "2024-03-03",
        time: 2,
        profilePattern: 3,
        pacePerHour: 2,
        perHourReport: 1,
        workingBehavior: 2,
      },
    ],
  },
};

const SingleUserQCPoints = () => {
  const { userId } = useParams();
  const [selectedDate, setSelectedDate] = useState(moment());

  // Fetch user data
  const user = dummyData[userId] || { name: "Unknown", avatar: "", points: [] };
  const userPoints = user.points.map((entry) => ({
    ...entry,
    totalPoints:
      entry.time +
      entry.profilePattern +
      entry.pacePerHour +
      entry.perHourReport +
      entry.workingBehavior,
  }));

  // Table Columns
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => <Text>{moment(date).format("YYYY-MM-DD")}</Text>,
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Profile Pattern",
      dataIndex: "profilePattern",
      key: "profilePattern",
    },
    {
      title: "Pace Per Hour",
      dataIndex: "pacePerHour",
      key: "pacePerHour",
    },
    {
      title: "Per Hour Report",
      dataIndex: "perHourReport",
      key: "perHourReport",
    },
    {
      title: "Working Behavior",
      dataIndex: "workingBehavior",
      key: "workingBehavior",
    },
    {
      title: "Total Points",
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

      {/* User Profile Section */}
      <div className="user-info">
        <Avatar src={user.avatar} size={64} icon={<UserOutlined />} />
        <Title level={4} className="user-name">
          {user.name}
        </Title>
      </div>
      <br />
      <br />
      {/* Date Picker for Filtering */}
      <DatePicker
        picker="month"
        value={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        className="date-filter"
      />
      <br />
      <br />

      {/* Table Displaying QC Points */}
      <Table
        columns={columns}
        dataSource={userPoints}
        rowKey="date"
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default SingleUserQCPoints;
