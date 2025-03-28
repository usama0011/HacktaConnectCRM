import React, { useState } from "react";
import { Table, Card, Typography, Button, Select, Input } from "antd";
import { DownloadOutlined, FileTextOutlined } from "@ant-design/icons";
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

  // Table Columns
  const columns = [
    { title: "Month", dataIndex: "month", key: "month" },
    { title: "Salary", dataIndex: "salary", key: "salary" },
    { title: "IP Clicks", dataIndex: "ipClicks", key: "ipClicks" },
    { title: "Sessions", dataIndex: "sessions", key: "sessions" },
    {
      title: "Download",
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
      <Title level={2} className="myrecord-title">
        My Records <FileTextOutlined />
      </Title>
      <Text className="myrecord-subtext">
        View your salary history and IP work details.
      </Text>

      {/* Filters */}
      <div className="myrecord-filters">
        <Input
          placeholder="Search Month..."
          onChange={(e) => setFilter(e.target.value)}
        />
        <Select defaultValue="all" onChange={(value) => console.log(value)}>
          <Option value="all">All</Option>
          <Option value="salary">Salary Records</Option>
          <Option value="ip">IP Work Records</Option>
        </Select>
      </div>

      {/* Records Table */}
      <Card className="myrecord-card">
        <Table
          dataSource={records.filter((r) =>
            r.month.toLowerCase().includes(filter.toLowerCase())
          )}
          columns={columns}
          pagination={{ pageSize: 5 }}
          rowKey="id"
        />
      </Card>
    </div>
  );
};

export default MyRecord;
