import "../../styles/AgentDailyIPReports.css";
import React, { useState, useEffect } from "react";
import {
  Table,
  Avatar,
  Typography,
  Button,
  Modal,
  InputNumber,
  DatePicker,
  Card,
  message,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";
import { useUserContext } from "../../context/UserContext"; // ✅ Import your context
import API from "../../utils/BaseURL";

const { Title, Text } = Typography;

const AgentDailyIPReports = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editHistory, setEditHistory] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({ sessions: 0, clicks: 0 });
  const [data, setData] = useState([]);

  const { user } = useUserContext(); // ✅ Get the logged-in user

  const fetchData = async () => {
    try {
      const res = await API.get(`/ip/daily-reports`, {
        params: {
          date: selectedDate.format("YYYY-MM-DD"),
        },
      });
      setData(res.data || []);
    } catch (error) {
      console.error("Error fetching agent IP reports:", error);
      message.error("Failed to fetch IP reports!");
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({ sessions: record.sessions, clicks: record.clicks });
    setEditHistory(record.history || []);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingRecord) return;
    try {
      await API.put(`/ip/update-ip/${editingRecord._id}`, {
        sessions: formData.sessions,
        clicks: formData.clicks,
        editor: user.username, // ✅ Send current user
      });
      message.success("Record updated successfully!");
      setIsModalOpen(false);
      fetchData(); // 🔄 Refresh table
    } catch (error) {
      console.error("Error updating record:", error);
      message.error("Failed to update record.");
    }
  };

  const columns = [
    {
      title: "👤 Profile",
      dataIndex: "username",
      key: "username",
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
      render: (record) => <strong>{record.totalIPs}</strong>,
    },
    {
      title: "⚙️ Actions",
      key: "actions",
      render: (record) => (
        <Button
          icon={<EditOutlined />}
          type="primary"
          onClick={() => handleEdit(record)}
          style={{ marginRight: 8, backgroundColor: "#003c2f" }}
        >
          Edit & History
        </Button>
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
        dataSource={data}
        rowKey="_id"
        className="user-table-singipoidsfisodf"
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        title="Edit Agent Record"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText="Save"
      >
        <div className="modal-user">
          <Avatar src={editingRecord?.avatar} />
          <Text strong style={{ marginLeft: 10 }}>
            {editingRecord?.username}
          </Text>
        </div>

        <div className="modal-fields" style={{ marginTop: 20 }}>
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
