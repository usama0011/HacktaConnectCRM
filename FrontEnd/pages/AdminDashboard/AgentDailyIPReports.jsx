import "../../styles/AgentDailyIPReports.css";
import React, { useState } from "react";
import {
  Table,
  Avatar,
  Typography,
  Button,
  Modal,
  InputNumber,
  DatePicker,
  Tag,
  Card,
} from "antd";
import {
  EditOutlined,
  HistoryOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "../../styles/AgentDailyIPReports.css";

const { Title, Text } = Typography;

const AgentDailyIPReports = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historyRecord, setHistoryRecord] = useState(null);
  const [editHistory, setEditHistory] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editHistoryVisible, setEditHistoryVisible] = useState(false);

  const [formData, setFormData] = useState({ sessions: 0, clicks: 0 });

  const dummyUsers = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    date: "2025-04-20",
    name: `Agent ${i + 1}`,
    avatar: `https://i.pravatar.cc/40?img=${i + 1}`,
    sessions: 100 + i,
    clicks: 200 + i,
    editedBy: "Umer Farooq",
    editTime: "2025-04-20 10:00 AM",
    history: [
      {
        editor: "Agent Submission", // original record
        timestamp: "2025-04-20 09:00 AM",
        sessions: 100 + i,
        clicks: 200 + i,
        isOriginal: true,
      },
      {
        editor: "Umer Farooq",
        timestamp: "2025-04-20 10:00 AM",
        sessions: 95 + i,
        clicks: 190 + i,
      },
      {
        editor: "Admin",
        timestamp: "2025-04-19 09:00 AM",
        sessions: 90 + i,
        clicks: 180 + i,
      },
    ],
  }));

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({ sessions: record.sessions, clicks: record.clicks });
    setEditHistory(record.history);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "👤 Profile",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span className="user-cell">
          <Avatar src={record.avatar} />
          <span className="user-name">{text}</span>
        </span>
      ),
    },
    {
      title: "📈 Sessions",
      dataIndex: "sessions",
      key: "sessions",
    },
    {
      title: "🖱 Clicks",
      dataIndex: "clicks",
      key: "clicks",
    },
    {
      title: "📊 Total",
      key: "total",
      render: (record) => <strong>{record.sessions + record.clicks}</strong>,
    },
    {
      title: "⚙️ Actions",
      key: "actions",
      render: (record) => (
        <>
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          >
            Edit & History
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="daily-ip-container">
      <div className="daily-ip-header">
        <Title level={3}>🗓 Agent IP Report - Daily</Title>
        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          className="daily-ip-picker"
        />
      </div>

      <Table
        columns={columns}
        dataSource={dummyUsers}
        rowKey="id"
        className="user-table-singipoidsfisodf"
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        title="Edit Agent Record"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => setIsModalOpen(false)}
        okText="Save"
      >
        <div className="modal-user">
          <Avatar src={editingRecord?.avatar} />
          <Text strong style={{ marginLeft: 10 }}>
            {editingRecord?.name}
          </Text>
        </div>

        <div className="modal-fields">
          <Text>Sessions:</Text>
          <InputNumber
            min={0}
            value={formData.sessions}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, sessions: val }))
            }
            style={{ width: "100%" }}
          />
          <Text>Clicks:</Text>
          <InputNumber
            min={0}
            value={formData.clicks}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, clicks: val }))
            }
            style={{ width: "100%" }}
          />
        </div>

        <div className="modal-history-section">
          <Title level={5} style={{ marginTop: 20 }}>
            Edit History
          </Title>
          {editHistory.length > 0 ? (
            editHistory.map((item, index) => (
              <Card
                key={index}
                className="history-item"
                size="small"
                style={{ marginBottom: 10 }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text strong>
                    {item.isOriginal ? "📝 Original Submission" : item.editor}
                  </Text>
                  <Text type="secondary">{item.timestamp}</Text>
                </div>
                <Text type="secondary">
                  Sessions: {item.sessions}, Clicks: {item.clicks}
                </Text>
              </Card>
            ))
          ) : (
            <Text type="secondary">No edit history found.</Text>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AgentDailyIPReports;
