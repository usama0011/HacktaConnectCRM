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
import { useUserContext } from "../../context/UserContext";

const { Title, Text } = Typography;
const { Option } = Select;

const AllUsersIPReport = () => {
  const navigate = useNavigate();
  const { user } = useUserContext(); // ⬅️ Get logged-in user
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [users, setUsers] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    shift: "",
    agentType: "",
    branch: "",
    agentName: "",

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
 agentName: filters.agentName || undefined,
        },
      });

      if (res.data.success) {
        setUsers(res.data.agents); // ✅ Filtered list
        setTopUsers(res.data.top3); // ✅ Global top 3
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
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const columns = [
    {
      title: "Full Name",
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
      render: (text) => text ? text.charAt(0).toUpperCase() + text.slice(1) : "",

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

      <div
        style={{ marginTop: 16, display: "flex", gap: 16, flexWrap: "wrap" }}
      >
        {/* Conditionally render Shift & Branch filters */}
        {!(
          user?.role === "Team Lead" ||
          user?.role === "Team Lead WFH" ||
          user?.role === "QC"
        ) && (
          <>
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
          </>
        )}

        {/* Agent Type filter is shown for all */}
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
          value={filters.username}
          onChange={(e) => handleFilterChange("agentName", e.target.value)}
          style={{ width: 200, borderRadius: "10px" }}
          allowClear
        />
        <Button type="primary" onClick={fetchUsers}>
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
    fetchUsers(); // fetch everything again
  }}
>
  Reset Filters
</Button>

      </div>

      <br />
      <br />
      <Title
        style={{ textAlign: "center" }}
        level={4}
        className="section-heading"
      >
        🏆 Top 3 Performing Agents
      </Title>
      <br />
      <Row gutter={[24, 24]} className="top-performers-row" justify="center">
        <br />
        <br />
        <div className="top-performers-list">
          {topUsers.map((user, index) => (
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
       pagination={{
  defaultPageSize: 50,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50", "100"],
}}
        bordered
        loading={loading}
        className="user-table-ppwork"
        scroll={{ x: "max-content" }} // ✅ Enables horizontal scroll
      />
    </div>
  );
};

export default AllUsersIPReport;
