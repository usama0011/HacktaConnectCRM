import React, { useState } from "react";
import {
  Table,
  Avatar,
  Typography,
  DatePicker,
  Button,
  Row,
  Col,
  Card,
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
import "../../styles/IPSubmission.css";
import TrophyIcon from "../../src/assets/tt.png";
const { Title, Text } = Typography;

// Dummy Data
const dummyUsers = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://i.pravatar.cc/40?u=johndoe",
    totalClicks: 120,
    totalSessions: 90,
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/40?u=janesmith",
    totalClicks: 100,
    totalSessions: 80,
  },
  {
    id: 3,
    name: "Emily Johnson",
    avatar: "https://i.pravatar.cc/40?u=emily",
    totalClicks: 90,
    totalSessions: 75,
  },
  {
    id: 4,
    name: "Michael Brown",
    avatar: "https://i.pravatar.cc/40?u=michael",
    totalClicks: 140,
    totalSessions: 95,
  },
  {
    id: 5,
    name: "New Brown",
    avatar: "https://i.pravatar.cc/40?u=michael",
    totalClicks: 220,
    totalSessions: 125,
  },
];
//Agent Reports ................
//name, avatar , shift , clicks ,sessions, clicks + sessions ,
//show calender above that fetcht the data based on date wise .
//Search by Username.

const AllUsersIPReport = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(moment());

  // Table Columns

  const columns = [
    {
      title: (
        <>
          <UserOutlined style={{ marginRight: 6 }} />
          User
        </>
      ),
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
      dataIndex: "totalSessions",
      key: "totalSessions",
      render: (sessions) => <Text>{sessions}</Text>,
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
  const filteredUsers = dummyUsers.filter(
    () => selectedMonth.format("YYYY-MM") === "2025-04"
  );

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
            🏆 Top 5 Performing Agents
          </Title>
          <div className="top-performers-list">
            {dummyUsers
              .sort(
                (a, b) =>
                  b.totalClicks +
                  b.totalSessions -
                  (a.totalClicks + a.totalSessions)
              )
              .slice(0, 5)
              .map((user, index) => (
                <Card key={user.id} className="top-performer-card">
                  <div className="performer-content">
                    <div className="performer-left">
                      <div className="rank-circle">{index + 1}</div>
                      <Avatar size={48} src={user.avatar} />
                      <div className="performer-details">
                        <Text className="performer-name">{user.name}</Text>
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
        dataSource={dummyUsers}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
        className="user-table-ppwork"
      />
    </div>
  );
};

export default AllUsersIPReport;
