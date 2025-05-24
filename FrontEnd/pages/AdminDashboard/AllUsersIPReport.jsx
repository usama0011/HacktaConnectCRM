import React, { useState, useEffect } from "react";
import {
  Table,
  Avatar,
  Typography,
  DatePicker,
  Button,
  Row,
  Col,
  Card,
  message,
  Select,
  Input,
} from "antd";
import {
  UserOutlined,
  FunnelPlotOutlined,
  FundProjectionScreenOutlined,
  GlobalOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import API from "../../utils/BaseURL";
import "../../styles/IPSubmission.css";
import TrophyIcon from "../../src/assets/tt.png";
import { Calendar } from "primereact/calendar";

const { Title, Text } = Typography;
const { Option } = Select;

const AllUsersIPReport = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    shift: "",
    agentType: "",
    branch: "",
    username: "", // ✅ Add this
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const year = selectedMonth.format("YYYY");
      const month = selectedMonth.format("MM");

      const res = await API.get(`/ip/myagentsagents/monthly`, {
        params: {
          year,
          month,
          shift: filters.shift || undefined,
          agentType: filters.agentType || undefined,
          branch: filters.branch || undefined,
          username: filters.username || undefined, // ✅ Include username
        },
      });

      if (res.data.success) {
        setUsers(res.data.agents);
      } else {
        message.error("Failed to fetch agents data");
      }
    } catch (error) {
      console.error(error);

      if (error.response && error.response.status === 404) {
        message.error(
          error.response.data.message ||
            "No data found for the selected filters."
        );
      } else {
        message.error("Error fetching agents data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedMonth]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const columns = [
    {
      title: "User",
      dataIndex: "username",
      key: "username",
      render: (text, record) => (
        <div className="user-info">
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <Text className="user-name">{text}</Text>
        </div>
      ),
    },
    {
      title: "Shift",
      dataIndex: "shift",
      key: "shift",
    },
    {
      title: "Agent Type",
      dataIndex: "agentType",
      key: "agentType",
    },
    {
      title: "Total Clicks",
      dataIndex: "totalClicks",
      key: "totalClicks",
    },
    {
      title: "Total Sessions",
      dataIndex: "totalSessions",
      key: "totalSessions",
    },
    {
      title: "Total IPs",
      dataIndex: "totalIPs",
      key: "totalIPs",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() =>
            navigate(`/admin/dashboard/ipreport/user/${record.id}`)
          }
        >
          {console.log(record)}
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="ipreport-container">
      <div className="ipreport-header">
        <div className="header-lefthy">
          <Title level={3} className="ipreport-title">
            📊 Agent IP Reports
          </Title>
        </div>
        <br />
        <div className="attendance-header">
          <Calendar
            value={selectedMonth.toDate()}
            onChange={(e) => setSelectedMonth(moment(e.value))}
            view="month"
            dateFormat="yy-mm"
            showIcon
            className="custom-month-picker"
          />
        </div>
      </div>

      {/* 🔍 Filters */}
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
          style={{ width: 200, borderRadius: "10px" }}
          allowClear
        />
        <Button type="primary" onClick={fetchUsers}>
          Apply Filters
        </Button>
      </div>

      <br />
        <Title style={{textAlign:"center"}} level={4} className="section-heading">
          🏆 Top 3 Performing Agents
        </Title>
      <Row gutter={[24, 24]} className="top-performers-row" justify="center">
        <br />
        <br />
        <div className="top-performers-list">
          {users
            .sort((a, b) => b.totalIPs - a.totalIPs)
            .slice(0, 3)
            .map((user, index) => (
              <Card key={user.id} className="top-performer-card">
                <div className="performer-content">
                  <div className="performer-left">
                    <div className="rank-circle">#{index + 1}</div>
                    <Avatar size={48} src={user.avatar} />
                    <div className="performer-details">
                      <Text className="performer-name">{user.username}</Text>
                      <Text type="secondary" className="performer-meta">
                        Clicks: {user.totalClicks} | Sessions:{" "}
                        {user.totalSessions}
                      </Text>
                    </div>
                  </div>
                  <img className="performer-icon" src={TrophyIcon} alt="rank" />
                </div>

                {/* ✅ Bottom wave */}
                <div className="performer-wave-footer" />
              </Card>
            ))}
        </div>
      </Row>
      <br />
      <br />
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{ pageSize: 50 }}
        bordered
        loading={loading}
        className="user-table-ppwork"
        scroll={{ x: "max-content" }} // ✅ Enables horizontal scroll
      />
    </div>
  );
};

export default AllUsersIPReport;
