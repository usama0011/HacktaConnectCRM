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
  Input,
} from "antd";
import {
  EditOutlined,
  UserOutlined,
  BarChartOutlined,
  OpenAIFilled,
  LineChartOutlined,
  SettingOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  DotChartOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useUserContext } from "../../context/UserContext";
import API from "../../utils/BaseURL";
import { Calendar } from "primereact/calendar";

const { Title, Text } = Typography;

const AgentDailyIPReports = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [filters, setFilters] = useState({
   shift: "",
  agentType: "",
  branch: "",
  agentName: "",
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editHistory, setEditHistory] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({ sessions: 0, clicks: 0 });
  const [data, setData] = useState([]);

  const { user } = useUserContext();
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const fetchData = async () => {
    try {
          setLoading(true);

      const res = await API.get(`/ip/daily-reports`, {
        params: {
          date: selectedDate.format("YYYY-MM-DD"),
    shift: filters.shift || undefined,
    agentType: filters.agentType || undefined,
    branch: filters.branch || undefined,
        agentName: filters.agentName || undefined,

        },
      });
      setData(res.data || []);
    } catch (error) {
      console.error("Error fetching agent IP reports:", error);
      if (error.response && error.response.status === 404) {
        message.error(
          error.response.data.message || "No matching users found."
        );
      } else {
        message.error("Failed to fetch IP reports!");
      }
    }
    finally {
    setLoading(false);
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
      await API.put(`/ip/update-ip/${editingRecord.userId}`, {
        sessions: formData.sessions,
        clicks: formData.clicks,
        editor: user.agentName, // from context
        date: selectedDate.format("YYYY-MM-DD"), // add selected date
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
  title: (
    <>
      <UserOutlined /> Profile
    </>
  ),
  dataIndex: "agentName",
  key: "agentName",
  render: (text, record) => (
    <span className="user-cell">
      <Avatar src={record.avatar} />
      <span className="user-name">{text}</span>
    </span>
  ),
},

    {
      title: (
        <>
          <BarChartOutlined /> Sessions
        </>
      ),
      dataIndex: "sessions",
      key: "sessions",
    },
    {
      title: (
        <>
          <OpenAIFilled /> Clicks
        </>
      ),
      dataIndex: "clicks",
      key: "clicks",
    },
    {
      title: (
        <>
          <LineChartOutlined /> Total
        </>
      ),
      key: "total",
      render: (record) => <strong>{record.totalIPs}</strong>,
    },
    {
      title: (
        <>
          <SettingOutlined /> Actions
        </>
      ),
      key: "actions",
      render: (record) => (
        <Button
          icon={<EditOutlined />}
          type="primary"
          onClick={() => handleEdit(record)}
          style={{ marginRight: 8, backgroundColor: "#1e2d7d" }}
        >
          Edit & History
        </Button>
      ),
    },
  ];
  console.log(editingRecord);
  return (
    <div className="daily-ip-container">
      <div className="daily-ip-header">
        <Title className="dailyiperagenside" level={3}>
          🗓 Agent IP Report - Daily
        </Title>
        <div className="attendance-header">
          <Calendar
            value={selectedDate.toDate()}
            onChange={(e) => setSelectedDate(moment(e.value))}
            dateFormat="yy-mm-dd"
            showIcon
            className="custom-date-picker"
          />
        </div>
      </div>

      {user?.role === "Team Lead" || "Team Lead WFH" || "QC" ? (
        <div
          style={{ marginTop: 16, display: "flex", gap: 16, flexWrap: "wrap" }}
        >
          <Select
    placeholder="Please select Shift"
    value={filters.shift || undefined}
    style={{ width: 180 }}
    onChange={(value) => handleFilterChange("shift", value)}
    allowClear
  >
    <Option disabled value="">
      Please select Shift
    </Option>
    <Option value="morning">Morning</Option>
    <Option value="evening">Evening</Option>
    <Option value="night">Night</Option>
  </Select>
   <Select
    placeholder="Please select Branch"
    value={filters.branch || undefined}
    style={{ width: 180 }}
    onChange={(value) => handleFilterChange("branch", value)}
    allowClear
  >
    <Option disabled value="">
      Please select Branch
    </Option>
    <Option value="Branch A">Branch A</Option>
    <Option value="Branch B">Branch B</Option>
  </Select>

          <Select
            placeholder="Please select Agent Type"
            value={filters.agentType || undefined}
            style={{ width: 180 }}
            onChange={(value) => handleFilterChange("agentType", value)}
            allowClear
          >
            <Option disabled value="">
              Please select Agent Type
            </Option>
            <Option value="Office Agent">Office Agent</Option>
            <Option value="WFH Agent">WFH Agent</Option>
          </Select>

<Input
  placeholder="Search by Agent Name"
  value={filters.agentName}
  onChange={(e) => handleFilterChange("agentName", e.target.value)}
  style={{ width: 200 }}
  allowClear
/>


          <Button type="primary" onClick={fetchData}>
            Apply Filters
          </Button>
          <Button
  onClick={() => {
    setFilters({
      shift: "",
      agentType: "",
      branch: "",
      agentName: "",
    });
    fetchData();
  }}
>
  Reset Filters
</Button>

        </div>
      ) : (
        <div
          style={{ marginTop: 16, display: "flex", gap: 16, flexWrap: "wrap" }}
        >
          <Select
            placeholder="Please select Shift"
            value={filters.shift || undefined}
            style={{ width: 180 }}
            onChange={(value) => handleFilterChange("shift", value)}
            allowClear
          >
            <Option disabled value="">
              Please select Shift
            </Option>
            <Option value="morning">Morning</Option>
            <Option value="evening">Evening</Option>
            <Option value="night">Night</Option>
          </Select>

          <Select
            placeholder="Please select Agent Type"
            value={filters.agentType || undefined}
            style={{ width: 180 }}
            onChange={(value) => handleFilterChange("agentType", value)}
            allowClear
          >
            <Option disabled value="">
              Please select Agent Type
            </Option>
            <Option value="Office Agent">Office Agent</Option>
            <Option value="WFH Agent">WFH Agent</Option>
          </Select>

          <Select
            placeholder="Please select Branch"
            value={filters.branch || undefined}
            style={{ width: 180 }}
            onChange={(value) => handleFilterChange("branch", value)}
            allowClear
          >
            <Option disabled value="">
              Please select Branch
            </Option>
            <Option value="Branch A">Branch A</Option>
            <Option value="Branch B">Branch B</Option>
          </Select>
          <Input
            placeholder="Search by Username"
            value={filters.username}
            onChange={(e) => handleFilterChange("username", e.target.value)}
            style={{ width: 200 }}
            allowClear
          />

          <Button type="primary" onClick={fetchData}>
            Apply Filters
          </Button>
        </div>
      )}
      <br />
      {/* 📋 Table */}
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: "max-content" }} // ✅ Enables horizontal scroll
        rowKey="_id"
        className="user-table-singipoidsfisodf"
                    pagination={{
  defaultPageSize: 50,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50", "100"],
}}  loading={loading}

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
           {editingRecord?.agentName}
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
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text strong>
                    {item.isOriginal ? (
                      <>
                        <FileTextOutlined style={{ marginRight: 6 }} />
                        Original Submission
                      </>
                    ) : (
                      <>
                        <UserOutlined style={{ marginRight: 6 }} />
                        {item.editor}
                      </>
                    )}
                  </Text>
                  <Text type="secondary">
                    <ClockCircleOutlined style={{ marginRight: 6 }} />
                    {item.timestamp}
                  </Text>
                </div>
                <Text type="secondary">
                  <BarChartOutlined style={{ marginRight: 6 }} />
                  Sessions: {item.sessions},{" "}
                  <DotChartOutlined style={{ marginRight: 6 }} />
                  Clicks: {item.clicks}
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
