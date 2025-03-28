import React from "react";
import { Card, Table, Tag, Button, Row, Col, Select } from "antd";
import { FileTextOutlined, BarChartOutlined } from "@ant-design/icons";
import { Line, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import "../../styles/Reporting.css";

const { Option } = Select;

const Reporting = () => {
  // Dummy Data for Reports Table
  const reportData = [
    {
      key: "1",
      reportName: "User Activity Log",
      createdBy: "Admin",
      type: "User",
      status: "Completed",
      date: "March 15, 2024",
    },
    {
      key: "2",
      reportName: "Performance Review",
      createdBy: "System",
      type: "Performance",
      status: "Pending",
      date: "March 10, 2024",
    },
    {
      key: "3",
      reportName: "Sales Analysis",
      createdBy: "Finance",
      type: "Sales",
      status: "Completed",
      date: "March 8, 2024",
    },
    {
      key: "4",
      reportName: "Security Audit",
      createdBy: "IT Team",
      type: "Security",
      status: "In Progress",
      date: "March 6, 2024",
    },
  ];

  const columns = [
    {
      title: "Report Name",
      dataIndex: "reportName",
      key: "reportName",
      render: (text) => <b>{text}</b>,
    },
    { title: "Created By", dataIndex: "createdBy", key: "createdBy" },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Completed"
              ? "green"
              : status === "Pending"
              ? "gold"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
    },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Button type="primary" size="small">
          View
        </Button>
      ),
    },
  ];

  // Line Chart Data
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Reports Generated",
        data: [10, 25, 35, 50, 40, 60],
        borderColor: "#1890ff",
        backgroundColor: "rgba(24, 144, 255, 0.2)",
        tension: 0.4,
      },
    ],
  };

  // Doughnut Chart Data
  const doughnutData = {
    labels: ["Completed", "Pending", "In Progress"],
    datasets: [
      {
        data: [45, 30, 25],
        backgroundColor: ["#52c41a", "#fadb14", "#ff4d4f"],
      },
    ],
  };

  return (
    <div className="reporting-container">
      <h2 className="reporting-title">Reports Management</h2>

      {/* Filter and Button */}
      <div className="reporting-filters">
        <Select placeholder="Filter by Type" className="reporting-select">
          <Option value="user">User Reports</Option>
          <Option value="performance">Performance Reports</Option>
          <Option value="sales">Sales Reports</Option>
          <Option value="security">Security Reports</Option>
        </Select>
        <Button type="primary" className="reporting-generate-button">
          Generate New Report
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* Reports Summary - Line Chart */}
        <Col xs={24} md={12}>
          <Card className="reporting-card">
            <h3>
              <BarChartOutlined /> Reports Over Time
            </h3>
            <Line data={lineChartData} />
          </Card>
        </Col>

        {/* Report Status - Doughnut Chart */}
        <Col xs={24} md={12}>
          <Card className="reporting-card">
            <h3>
              <FileTextOutlined /> Report Status
            </h3>
            <Doughnut style={{ maxHeight: "350px" }} data={doughnutData} />
          </Card>
        </Col>
      </Row>
      <br />

      {/* Recent Reports Table */}
      <Card className="reporting-card">
        <h3>Recent Reports</h3>
        <Table
          columns={columns}
          dataSource={reportData}
          pagination={{ pageSize: 4 }}
        />
      </Card>
    </div>
  );
};

export default Reporting;
