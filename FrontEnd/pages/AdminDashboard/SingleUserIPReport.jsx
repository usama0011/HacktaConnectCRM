import React, { useState } from "react";
import {
  Table,
  Typography,
  Avatar,
  DatePicker,
  Button,
  Modal,
  Input,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import moment from "moment";
import "../../styles/IPSubmission.css";

const { Title, Text } = Typography;

// Dummy User Data
const dummyUsers = {
  1: { name: "John Doe", avatar: "https://i.pravatar.cc/50?u=johndoe" },
  2: { name: "Jane Smith", avatar: "https://i.pravatar.cc/50?u=janesmith" },
};

// Dummy Data (Date-wise Submission)
const dummyData = {
  1: [
    { date: "2024-03-01", clicks: 20, sessions: 10 },
    { date: "2024-03-02", clicks: 25, sessions: 15 },
    { date: "2024-03-03", clicks: 30, sessions: 12 },
  ],
  2: [
    { date: "2024-03-01", clicks: 15, sessions: 8 },
    { date: "2024-03-02", clicks: 18, sessions: 10 },
    { date: "2024-03-03", clicks: 22, sessions: 9 },
  ],
};
//In View Report There is also show an Calender .
//By Default tha date comes from parent page .
//JOining Date in Front of User Avatar .
//Date,  Shift ,
const SingleUserIPReport = () => {
  const { userId } = useParams();
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [userSubmissions, setUserSubmissions] = useState(
    dummyData[userId] || []
  );
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [newClicks, setNewClicks] = useState(0);
  const [newSessions, setNewSessions] = useState(0);

  // Fetch user details
  const user = dummyUsers[userId] || { name: "Unknown User", avatar: null };

  // Open Edit Modal
  const handleEdit = (record) => {
    setSelectedRecord(record);
    setNewClicks(record.clicks);
    setNewSessions(record.sessions);
    setEditModalVisible(true);
  };

  // Save Updated Data
  const handleSave = () => {
    setUserSubmissions((prevData) =>
      prevData.map((entry) =>
        entry.date === selectedRecord.date
          ? { ...entry, clicks: newClicks, sessions: newSessions }
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
      title: "Clicks",
      dataIndex: "clicks",
      key: "clicks",
    },
    {
      title: "Sessions",
      dataIndex: "sessions",
      key: "sessions",
    },
    {
      title: "Total Count",
      key: "totalCount",
      render: (record) => <Text strong>{record.clicks + record.sessions}</Text>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              style={{ marginRight: "10px" }}
              onClick={() => handleEdit(record)}
            >
              Edit History
            </Button>
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
              Edit
            </Button>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="ipreport-container">
      {/* User Info Section */}
      <div className="static-month-display">
        <CalendarOutlined style={{ marginRight: 8 }} />
        <span className="static-month-text">April 2025</span>
      </div>
      <br />
      <br />
      <div className="user-info-header">
        <Avatar src={user.avatar} icon={<UserOutlined />} size={64} />
        <Title level={3}>{user.name}</Title>
      </div>

      {/* Data Table */}
      <Table
        columns={columns}
        dataSource={userSubmissions}
        rowKey="date"
        pagination={{ pageSize: 5 }}
        bordered
      />

      {/* Edit Modal */}
      <Modal
        title="Edit Submission"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSave}
      >
        <Text strong>Date: </Text>
        <Text>{selectedRecord?.date}</Text>
        <br />
        <Text strong>Clicks:</Text>
        <Input
          type="number"
          value={newClicks}
          onChange={(e) => setNewClicks(Number(e.target.value))}
        />
        <br />
        <Text strong>Sessions:</Text>
        <Input
          type="number"
          value={newSessions}
          onChange={(e) => setNewSessions(Number(e.target.value))}
        />
      </Modal>
    </div>
  );
};

export default SingleUserIPReport;
