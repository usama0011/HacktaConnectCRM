import React, { useState } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Select,
  Input,
  DatePicker,
  Row,
  Col,
} from "antd";
import {
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  DollarCircleOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import "../../styles/SalaryManagement.css";

const { Option } = Select;

const SalaryManagement = () => {
  const [search, setSearch] = useState("");

  // Dummy Salary Data
  const salaryData = [
    {
      key: "1",
      employee: "John Doe",
      department: "Engineering",
      amount: "$5000",
      status: "Paid",
      date: "April 2024",
    },
    {
      key: "2",
      employee: "Alice Smith",
      department: "Marketing",
      amount: "$4200",
      status: "Pending",
      date: "April 2024",
    },
    {
      key: "3",
      employee: "Robert Johnson",
      department: "HR",
      amount: "$3800",
      status: "Paid",
      date: "April 2024",
    },
    {
      key: "4",
      employee: "Emily Davis",
      department: "Finance",
      amount: "$5300",
      status: "Pending",
      date: "April 2024",
    },
  ];

  const columns = [
    {
      title: "Employee",
      dataIndex: "employee",
      key: "employee",
      render: (text) => <b>{text}</b>,
    },
    { title: "Department", dataIndex: "department", key: "department" },
    {
      title: "Salary Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Paid" ? "green" : "red"}>{status}</Tag>
      ),
    },
    { title: "Month", dataIndex: "date", key: "date" },
    {
      title: "Actions",
      key: "action",
      render: () => (
        <Button type="primary" size="small">
          Details
        </Button>
      ),
    },
  ];

  // Chart Data (Salary Trends)
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Total Salaries Paid ($)",
        data: [20000, 21000, 23000, 25000, 24000, 26000],
        borderColor: "#1890ff",
        backgroundColor: "rgba(24, 144, 255, 0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="salary-container">
      <h2 className="salary-title">
        <DollarCircleOutlined /> Salary & Accounts Management
      </h2>

      {/* Filters and Actions */}
      <div className="salary-filters">
        <Input
          placeholder="Search Employee..."
          onChange={(e) => setSearch(e.target.value)}
          className="salary-search"
        />
        <DatePicker picker="month" className="salary-date" />
        <Select placeholder="Select Status" className="salary-select">
          <Option value="all">All</Option>
          <Option value="paid">Paid</Option>
          <Option value="pending">Pending</Option>
        </Select>
        <Button type="primary" className="salary-generate-button">
          <FileExcelOutlined /> Generate Report
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* Salary Trends Graph */}
        <Col xs={24} md={12}>
          <Card className="salary-card">
            <h3>
              <BarChartOutlined /> Salary Trends
            </h3>
            <Line data={lineChartData} />
          </Card>
        </Col>

        {/* Download Reports */}
        <Col xs={24} md={12}>
          <Card className="salary-card">
            <h3>
              <DownloadOutlined /> Download Reports
            </h3>
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              className="salary-download-button"
            >
              Download Excel
            </Button>
            <Button
              type="danger"
              icon={<FilePdfOutlined />}
              className="salary-download-button"
            >
              Download PDF
            </Button>
          </Card>
        </Col>
      </Row>
      <br />

      {/* Salary Table */}
      <Card className="salary-card">
        <h3>Salary Records</h3>
        <Table
          columns={columns}
          dataSource={salaryData}
          pagination={{ pageSize: 4 }}
        />
      </Card>
    </div>
  );
};

export default SalaryManagement;
