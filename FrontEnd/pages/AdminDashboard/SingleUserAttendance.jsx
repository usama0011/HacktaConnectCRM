import React, { useState } from "react";
import {
  Table,
  Typography,
  Avatar,
  DatePicker,
  Button,
  Modal,
  Select,
} from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import moment from "moment";
import "../../styles/Attendance.css";

const { Title, Text } = Typography;
const { Option } = Select;

// Dummy User Data
const dummyUsers = {
  1: { name: "John Doe", avatar: "https://i.pravatar.cc/50?u=johndoe" },
  2: { name: "Jane Smith", avatar: "https://i.pravatar.cc/50?u=janesmith" },
};

// Dummy Attendance Data (Day-wise)
const dummyData = {
  1: [
    {
      date: "2024-03-01",
      status: "Present",
      checkInTime: "09:00 AM",
      checkOutTime: "05:00 PM",
    },
    {
      date: "2024-03-02",
      status: "Late",
      checkInTime: "10:30 AM",
      checkOutTime: "06:00 PM",
    },
    {
      date: "2024-03-03",
      status: "Absent",
      checkInTime: null,
      checkOutTime: null,
    },
  ],
  2: [
    {
      date: "2024-03-01",
      status: "Present",
      checkInTime: "08:45 AM",
      checkOutTime: "04:45 PM",
    },
    {
      date: "2024-03-02",
      status: "Leave",
      checkInTime: null,
      checkOutTime: null,
    },
    {
      date: "2024-03-03",
      status: "Present",
      checkInTime: "09:10 AM",
      checkOutTime: "05:15 PM",
    },
  ],
};

const SingleUserAttendance = () => {
  const { userId, month } = useParams();
  const [selectedMonth, setSelectedMonth] = useState(moment(month, "YYYY-MM"));
  const [attendanceData, setAttendanceData] = useState(dummyData[userId] || []);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // Fetch user details
  const user = dummyUsers[userId] || { name: "Unknown User", avatar: null };

  // Open Edit Modal
  const handleEdit = (record) => {
    setSelectedRecord(record);
    setNewStatus(record.status);
    setEditModalVisible(true);
  };

  // Save Updated Data
  const handleSave = () => {
    setAttendanceData((prevData) =>
      prevData.map((entry) =>
        entry.date === selectedRecord.date
          ? { ...entry, status: newStatus }
          : entry
      )
    );
    setEditModalVisible(false);
  };

  // Table Columns
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => <Text>{moment(date).format("YYYY-MM-DD")}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Text strong>{status}</Text>,
    },
    {
      title: "Check-In",
      dataIndex: "checkInTime",
      key: "checkInTime",
      render: (time) => <Text>{time || "--"}</Text>,
    },
    {
      title: "Check-Out",
      dataIndex: "checkOutTime",
      key: "checkOutTime",
      render: (time) => <Text>{time || "--"}</Text>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="attendance-container">
      {/* User Info Section */}
      <DatePicker
        picker="month"
        value={selectedMonth}
        onChange={(date) => setSelectedMonth(date)}
        className="date-filter"
      />
      <br />
      <br />
      <div className="user-info-header">
        <Avatar src={user.avatar} icon={<UserOutlined />} size={64} />
        <Title level={3}>{user.name}</Title>
      </div>

      {/* Data Table */}
      <Table
        columns={columns}
        dataSource={attendanceData}
        rowKey="date"
        pagination={{ pageSize: 5 }}
        bordered
      />

      {/* Edit Modal */}
      <Modal
        title="Edit Attendance"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSave}
      >
        <Text strong>Date: </Text>
        <Text>{selectedRecord?.date}</Text>
        <br />
        <Text strong>Status:</Text>
        <Select
          value={newStatus}
          onChange={(value) => setNewStatus(value)}
          style={{ width: "100%" }}
        >
          <Option value="Present">Present</Option>
          <Option value="Absent">Absent</Option>
          <Option value="Late">Late</Option>
          <Option value="RotationOff">Rotation Off</Option>
          <Option value="Leave">Leave</Option>
        </Select>
      </Modal>
    </div>
  );
};

export default SingleUserAttendance;
