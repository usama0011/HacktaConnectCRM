import React from "react";
import { Table, Card, Row, Col, Tag } from "antd";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import moment from "moment";
import "../../styles/ProxyUsage.css";

const ProxyUsage = () => {
  // Dummy usage data for SmartProxy, MangoProxy, and Geonode
  const usageData = [
    {
      platform: "SmartProxy",
      totalUsage: 50,
      proxies: [
        {
          proxyIp: "134.209.10.10",
          location: "USA",
          usage: 20,
          status: "Active",
        },
        {
          proxyIp: "134.209.10.11",
          location: "Canada",
          usage: 10,
          status: "Active",
        },
      ],
    },
    {
      platform: "MangoProxy",
      totalUsage: 35,
      proxies: [
        {
          proxyIp: "193.110.45.12",
          location: "Germany",
          usage: 15,
          status: "Inactive",
        },
        {
          proxyIp: "193.110.45.13",
          location: "France",
          usage: 20,
          status: "Active",
        },
      ],
    },
    {
      platform: "Geonode",
      totalUsage: 42,
      proxies: [
        {
          proxyIp: "207.154.21.22",
          location: "UK",
          usage: 12,
          status: "Active",
        },
        {
          proxyIp: "207.154.21.23",
          location: "India",
          usage: 30,
          status: "Active",
        },
      ],
    },
  ];

  // Chart Data (Dummy Monthly GB usage)
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: usageData.map((provider) => ({
      label: `${provider.platform} (GB)`,
      data: [
        Math.floor(Math.random() * 10 + 5),
        Math.floor(Math.random() * 10 + 10),
        Math.floor(Math.random() * 10 + 15),
        Math.floor(Math.random() * 10 + 10),
        Math.floor(Math.random() * 10 + 20),
        Math.floor(Math.random() * 10 + 10),
        Math.floor(Math.random() * 10 + 15),
      ],
      borderColor:
        provider.platform === "SmartProxy"
          ? "#032212"
          : provider.platform === "MangoProxy"
          ? "#d48806"
          : "#722ed1",
      backgroundColor: "transparent",
      tension: 0.4,
    })),
  };

  // Columns for proxy detail table
  const columns = [
    { title: "Proxy IP", dataIndex: "proxyIp", key: "proxyIp" },
    { title: "Location", dataIndex: "location", key: "location" },
    {
      title: "Usage (GB)",
      dataIndex: "usage",
      key: "usage",
      render: (text) => `${text} GB`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
  ];

  return (
    <div className="proxy-usage-container">
      <h2 className="proxy-usage-title">Proxy Usage Dashboard</h2>

      {/* Usage Graph */}
      <Card className="proxy-usage-card" style={{ marginBottom: 24 }}>
        <h3>Monthly Proxy Usage by Provider</h3>
        <Line data={chartData} />
      </Card>

      {/* Table per provider */}
      <Row gutter={[16, 16]}>
        {usageData.map((provider, index) => (
          <Col xs={24} md={8} key={index}>
            <Card className="proxy-usage-card">
              <h3>{provider.platform}</h3>
              <p>
                <strong>Total Usage:</strong> {provider.totalUsage} GB
              </p>
              <Table
                columns={columns}
                dataSource={provider.proxies.map((p, i) => ({ ...p, key: i }))}
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProxyUsage;
