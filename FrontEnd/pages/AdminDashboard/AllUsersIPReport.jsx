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
import API from "../../utils/BaseURL"; // ✅ your Axios base URL setup
import "../../styles/IPSubmission.css";
import TrophyIcon from "../../src/assets/tt.png"; // fix your import path

const { Title, Text } = Typography;

const AllUsersIPReport = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const year = selectedMonth.format("YYYY");
      const month = selectedMonth.format("MM");

      const res = await API.get(`/ip/myagentsagents/monthly`, {
        params: { year, month },
      });

      if (res.data.success) {
        setUsers(res.data.agents);
      } else {
        message.error("Failed to fetch agents data");
      }
    } catch (error) {
      console.error(error);
      message.error("Error fetching agents data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedMonth]);

  const columns = [
    {
      title: (
        <>
          <UserOutlined style={{ marginRight: 6 }} />
          User
        </>
      ),
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
      title: (
        <>
          <FunnelPlotOutlined style={{ marginRight: 6 }} />
          Total Clicks
        </>
      ),
      dataIndex: "totalClicks",
      key: "totalClicks",
      render: (clicks) => <Text>{clicks}</Text>,
    },
    {
      title: (
        <>
          <FundProjectionScreenOutlined style={{ marginRight: 6 }} />
          Total Sessions
        </>
      ),
      dataIndex: "totalSessions",
      key: "totalSessions",
      render: (sessions) => <Text>{sessions}</Text>,
    },
    {
      title: (
        <>
          <GlobalOutlined style={{ marginRight: 6 }} />
          Total IPs
        </>
      ),
      dataIndex: "totalIPs",
      key: "totalIPs",
      render: (ips) => <Text>{ips}</Text>,
    },
    {
      title: (
        <>
          <EyeOutlined style={{ marginRight: 6 }} />
          Actions
        </>
      ),
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() =>
            navigate(`/admin/dashboard/ipreport/user/${record.id}`)
          }
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="ipreport-container">
      <div className="ipreport-header">
        <div className="header-left">
          <Title level={3} className="ipreport-title">
            📊 Agent IP Reports
          </Title>
          <Text type="secondary">
            Showing reports for:{" "}
            <strong>{selectedMonth.format("MMMM YYYY")}</strong>
          </Text>
        </div>
        <DatePicker
          picker="month"
          value={selectedMonth}
          onChange={(date) => setSelectedMonth(date || moment())}
          className="ipreport-month-picker"
        />
      </div>
      <br />
      <Row gutter={[24, 24]} className="top-performers-row">
        <Col span={24}>
          <Title level={4} className="section-heading">
            🏆 Top 3 Performing Agents
          </Title>
          <div className="top-performers-list">
            {users
              .sort((a, b) => b.totalIPs - a.totalIPs)
              .slice(0, 3)
              .map((user, index) => (
                <Card key={user.id} className="top-performer-card">
                  <div className="performer-content">
                    <div className="performer-left">
                      <div className="rank-circle">{index + 1}</div>
                      <Avatar size={48} src={user.avatar} />
                      <div className="performer-details">
                        <Text className="performer-name">{user.username}</Text>
                        <Text type="secondary" className="performer-meta">
                          Clicks: {user.totalClicks} | Sessions:{" "}
                          {user.totalSessions}
                        </Text>
                      </div>
                    </div>
                    <img
                      className="performer-icon"
                      src={TrophyIcon}
                      alt="rank"
                    />
                  </div>
                </Card>
              ))}
          </div>
        </Col>
      </Row>
      <br />
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{ pageSize:50 }}
        bordered
        loading={loading}
        className="user-table-ppwork"
      />
    </div>
  );
};

export default AllUsersIPReport;
