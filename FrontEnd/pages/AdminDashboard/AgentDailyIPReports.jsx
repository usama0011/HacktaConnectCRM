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
  Select,
  Row,
  Col,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";
import { useUserContext } from "../../context/UserContext";
import API from "../../utils/BaseURL";

const { Title, Text } = Typography;

const AgentDailyIPReports = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [filters, setFilters] = useState({ shift: "", agentType: "", branch: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editHistory, setEditHistory] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({ sessions: 0, clicks: 0 });
  const [data, setData] = useState([]);

  const { user } = useUserContext();

  const fetchData = async () => {
    try {
      const res = await API.get(`/ip/daily-reports`, {
        params: {
          date: selectedDate.format("YYYY-MM-DD"),
          shift: filters.shift || undefined,
          agentType: filters.agentType || undefined,
          branch: filters.branch || undefined,
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
        editor: user.username,
      });
      message.success("Record updated successfully!");
      setIsModalOpen(false);
      fetchData();
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
    { title: "📈 Sessions", dataIndex: "sessions", key: "sessions" },
    { title: "🖱 Clicks", dataIndex: "clicks", key: "clicks" },
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

      {/* 🔍 Filters */}
      <div style={{ marginTop: 16, marginBottom: 24 }}>
        <Row gutter={16}>
          <Col>
            <label>Shift</label>
            <Select
              value={filters.shift}
              onChange={(value) => setFilters({ ...filters, shift: value })}
              style={{ width: 160 }}
              placeholder="All"
              allowClear
            >
              <Select.Option value="morning">Morning</Select.Option>
              <Select.Option value="evening">Evening</Select.Option>
              <Select.Option value="night">Night</Select.Option>
            </Select>
          </Col>
          <Col>
            <label>Agent Type</label>
            <Select
              value={filters.agentType}
              onChange={(value) => setFilters({ ...filters, agentType: value })}
              style={{ width: 160 }}
              placeholder="All"
              allowClear
            >
              <Select.Option value="Office Agent">Office Agent</Select.Option>
              <Select.Option value="WFH Agent">WFH Agent</Select.Option>
            </Select>
          </Col>
          <Col>
            <label>Branch</label>
            <Select
              value={filters.branch}
              onChange={(value) => setFilters({ ...filters, branch: value })}
              style={{ width: 160 }}
              placeholder="All"
              allowClear
            >
              <Select.Option value="Branch A">Branch A</Select.Option>
              <Select.Option value="Branch B">Branch B</Select.Option>
              <Select.Option value="Branch C">Branch C</Select.Option>
            </Select>
          </Col>
          <Col>
            <Button
              type="primary"
              style={{ marginTop: 1 }}
              onClick={fetchData}
            >
              Apply Filters
            </Button>
          </Col>
        </Row>
      </div>

      {/* 📋 Table */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        className="user-table-singipoidsfisodf"
        pagination={{ pageSize: 10 }}
        bordered
      />

      {/* 📝 Modal */}
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

        <div style={{ marginTop: 20 }}>
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
              <Card key={index} className="history-item" size="small">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
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
