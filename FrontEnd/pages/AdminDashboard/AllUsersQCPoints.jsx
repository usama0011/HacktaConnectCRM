import React, { useState } from "react";
import { Table, Typography, Avatar, Button, DatePicker } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "../../styles/QCPoints.css";

const { Title, Text } = Typography;

// Dummy User Data with Total QC Points
const dummyUsers = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://i.pravatar.cc/50?u=johndoe",
    totalPoints: 120,
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/50?u=janesmith",
    totalPoints: 110,
  },
  {
    id: 3,
    name: "Emily Johnson",
    avatar: "https://i.pravatar.cc/50?u=emily",
    totalPoints: 98,
  },
  {
    id: 4,
    name: "Michael Brown",
    avatar: "https://i.pravatar.cc/50?u=michael",
    totalPoints: 135,
  },
];

const AllUsersQCPoints = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(moment());

  // Handle Calendar Selection (Year & Month)
  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log("Fetching data for:", date.format("YYYY-MM"));
    // API Call can be added here to fetch filtered data
  };

  // Table Columns
  const columns = [
    {
      title: "User",
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
      title: "Total QC Points",
      dataIndex: "totalPoints",
      key: "totalPoints",
      render: (points) => <Text strong>{points}</Text>,
    },
    {
      title: "View QC Points",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() =>
            navigate(
              `/admin/dashboard/qcpoints/user/${
                record.id
              }?date=${selectedDate.format("YYYY-MM")}`
            )
          }
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="qcpoints-container">
      <Title level={2} className="qcpoints-title">
        All Users QC Points
      </Title>

      {/* Date Picker for Year & Month Selection */}
      <div className="date-filter">
        <Text style={{ marginRight: "10px" }}>Select Year & Month:</Text>
        <DatePicker
          picker="month"
          value={selectedDate}
          onChange={handleDateChange}
          className="calendar-picker"
        />
      </div>
      <br />
      <br />

      <Table
        columns={columns}
        dataSource={dummyUsers}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default AllUsersQCPoints;
