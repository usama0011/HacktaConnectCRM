import React, { useState } from "react";
import { Table, Card, Typography, Button, Select, Input } from "antd";
import {
  DownloadOutlined,
  FileTextOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
  GlobalOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import "../../styles/MyRecord.css";

const { Title, Text } = Typography;
const { Option } = Select;

const MyRecord = () => {
  const [filter, setFilter] = useState("");
  const [records] = useState([
    { id: 1, month: "July 2024", salary: "$2500", ipClicks: 500, sessions: 50 },
    { id: 2, month: "June 2024", salary: "$2400", ipClicks: 480, sessions: 48 },
    { id: 3, month: "May 2024", salary: "$2300", ipClicks: 460, sessions: 46 },
  ]);

  const columns = [
    {
      title: (
        <span>
          <CalendarOutlined style={{ marginRight: 6 }} />
          Month
        </span>
      ),
      dataIndex: "month",
      key: "month",
    },
    {
      title: (
        <span>
          <DollarCircleOutlined style={{ marginRight: 6 }} />
          Salary
        </span>
      ),
      dataIndex: "salary",
      key: "salary",
    },
    {
      title: (
        <span>
          <GlobalOutlined style={{ marginRight: 6 }} />
          IP Clicks
        </span>
      ),
      dataIndex: "ipClicks",
      key: "ipClicks",
    },
    {
      title: (
        <span>
          <DesktopOutlined style={{ marginRight: 6 }} />
          Sessions
        </span>
      ),
      dataIndex: "sessions",
      key: "sessions",
    },
    {
      title: (
        <span>
          <DownloadOutlined style={{ marginRight: 6 }} />
          Download
        </span>
      ),
      key: "download",
      render: () => (
        <Button type="link" icon={<DownloadOutlined />}>
          Download Report
        </Button>
      ),
    },
  ];
  return (
    <div className="myrecord-container">
      <div className="myrecord-header">
        <Title level={2} className="myrecord-title">
          <FileTextOutlined style={{ marginRight: 10 }} />
          My Records
        </Title>
        <Text className="myrecord-subtext">
          View your salary history and IP work details.
        </Text>
      </div>

      {/* Filters */}
      <div className="myrecord-filters">
        <Input
          placeholder="Search by month..."
          onChange={(e) => setFilter(e.target.value)}
          className="myrecord-input"
        />
        <Select
          defaultValue="all"
          className="myrecord-select"
          onChange={(value) => console.log(value)}
        >
          <Option value="all">All</Option>
          <Option value="salary">Salary Records</Option>
          <Option value="ip">IP Work Records</Option>
        </Select>
      </div>
      <div className="myrecord-table">
        <Table
          dataSource={records.filter((r) =>
            r.month.toLowerCase().includes(filter.toLowerCase())
          )}
          columns={columns}
          pagination={{ pageSize: 5 }}
          rowKey="id"
          className="myrecord-table"
        />
      </div>
      {/* Records Table */}
    </div>
  );
};

export default MyRecord;
