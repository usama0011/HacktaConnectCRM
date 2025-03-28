import React, { useState } from "react";
import { Table, Typography, Input, Avatar, Button, DatePicker } from "antd";
import { EditOutlined, SaveOutlined, UserOutlined } from "@ant-design/icons";
import moment from "moment";
import "../../styles/QCPoints.css";

const { Title, Text } = Typography;

// Dummy User Data
const dummyUsers = [
  { id: 1, name: "John Doe", avatar: "https://i.pravatar.cc/50?u=johndoe" },
  { id: 2, name: "Jane Smith", avatar: "https://i.pravatar.cc/50?u=janesmith" },
  { id: 3, name: "Emily Johnson", avatar: "https://i.pravatar.cc/50?u=emily" },
  {
    id: 4,
    name: "Michael Brown",
    avatar: "https://i.pravatar.cc/50?u=michael",
  },
];

const QCPoints = () => {
  const [users, setUsers] = useState(
    dummyUsers.map((user) => ({
      ...user,
      time: "",
      profilePattern: "",
      pacePerHour: "",
      perHourReport: "",
      workingBehavior: "",
      totalPoints: 0,
      editing: false,
    }))
  );

  const [selectedDate, setSelectedDate] = useState(moment());

  // Handle Input Change
  const handleInputChange = (id, field, value) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              [field]: value,
              totalPoints:
                Number(user.time || 0) +
                Number(user.profilePattern || 0) +
                Number(user.pacePerHour || 0) +
                Number(user.perHourReport || 0) +
                Number(user.workingBehavior || 0),
            }
          : user
      )
    );
  };

  // Toggle Edit Mode
  const toggleEditMode = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, editing: !user.editing } : user
      )
    );
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
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (text, record) => (
        <Input
          value={record.time}
          onChange={(e) => handleInputChange(record.id, "time", e.target.value)}
          disabled={!record.editing}
          placeholder="Enter Time"
        />
      ),
    },
    {
      title: "Profile Pattern",
      dataIndex: "profilePattern",
      key: "profilePattern",
      render: (text, record) => (
        <Input
          value={record.profilePattern}
          onChange={(e) =>
            handleInputChange(record.id, "profilePattern", e.target.value)
          }
          disabled={!record.editing}
          placeholder="Enter Profile Pattern"
        />
      ),
    },
    {
      title: "Pace Per Hour",
      dataIndex: "pacePerHour",
      key: "pacePerHour",
      render: (text, record) => (
        <Input
          value={record.pacePerHour}
          onChange={(e) =>
            handleInputChange(record.id, "pacePerHour", e.target.value)
          }
          disabled={!record.editing}
          placeholder="Enter Pace Per Hour"
        />
      ),
    },
    {
      title: "Per Hour Report",
      dataIndex: "perHourReport",
      key: "perHourReport",
      render: (text, record) => (
        <Input
          value={record.perHourReport}
          onChange={(e) =>
            handleInputChange(record.id, "perHourReport", e.target.value)
          }
          disabled={!record.editing}
          placeholder="Enter Per Hour Report"
        />
      ),
    },
    {
      title: "Working Behavior",
      dataIndex: "workingBehavior",
      key: "workingBehavior",
      render: (text, record) => (
        <Input
          value={record.workingBehavior}
          onChange={(e) =>
            handleInputChange(record.id, "workingBehavior", e.target.value)
          }
          disabled={!record.editing}
          placeholder="Enter Working Behavior"
        />
      ),
    },
    {
      title: "Total Points",
      dataIndex: "totalPoints",
      key: "totalPoints",
      render: (text, record) => (
        <Input value={record.totalPoints} disabled placeholder="Total Points" />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          icon={record.editing ? <SaveOutlined /> : <EditOutlined />}
          onClick={() => toggleEditMode(record.id)}
        >
          {record.editing ? "Save" : "Edit"}
        </Button>
      ),
    },
  ];

  return (
    <div className="qcpoints-container">
      <Title level={2} className="qcpoints-title">
        QC Points - {selectedDate.format("YYYY-MM-DD")}
      </Title>

      {/* Date Picker for Selecting the Date */}
      <div className="date-filter">
        <Text>Select Date:</Text>
        <DatePicker
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="calendar-picker"
          format="YYYY-MM-DD"
        />
      </div>
      <br />
      <br />

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default QCPoints;
