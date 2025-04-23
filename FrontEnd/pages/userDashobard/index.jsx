import React from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Avatar,
  Button,
  Progress,
  Table,
} from "antd";
import {
  RiseOutlined,
  DollarCircleOutlined,
  BarChartOutlined,
  UserOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import "../../styles/UserDashboard.css";
import DateTimeDisplay from "../../components/DateTimeDisplay";
import ComputerIcon from "../../src/assets/computer.png";
import ComputerClick from "../../src/assets/click.png";
import ComputerPoints from "../../src/assets/point.png";
import { Column } from "@ant-design/plots";

const UserDashboard = () => {
  // Mock 30-day data (replace with real backend data)
  const ipData = [
    { date: "Mar 21", totalIPs: 104 },
    { date: "Mar 22", totalIPs: 58 },
    { date: "Mar 23", totalIPs: 75 },
    { date: "Mar 24", totalIPs: 190 },
    { date: "Mar 25", totalIPs: 156 },
    { date: "Mar 26", totalIPs: 122 },
    { date: "Mar 27", totalIPs: 138 },
    { date: "Mar 28", totalIPs: 144 },
    { date: "Mar 29", totalIPs: 91 },
    { date: "Mar 30", totalIPs: 69 },
    { date: "Mar 31", totalIPs: 132 },
    { date: "Apr 01", totalIPs: 149 },
    { date: "Apr 02", totalIPs: 174 },
    { date: "Apr 03", totalIPs: 88 },
    { date: "Apr 04", totalIPs: 99 },
    { date: "Apr 05", totalIPs: 180 },
    { date: "Apr 06", totalIPs: 63 },
    { date: "Apr 07", totalIPs: 133 },
    { date: "Apr 08", totalIPs: 151 },
    { date: "Apr 09", totalIPs: 139 },
    { date: "Apr 10", totalIPs: 171 },
    { date: "Apr 11", totalIPs: 65 },
    { date: "Apr 12", totalIPs: 70 },
    { date: "Apr 13", totalIPs: 195 },
    { date: "Apr 14", totalIPs: 127 },
    { date: "Apr 15", totalIPs: 91 },
    { date: "Apr 16", totalIPs: 130 },
    { date: "Apr 17", totalIPs: 83 },
    { date: "Apr 18", totalIPs: 93 },
    { date: "Apr 19", totalIPs: 189 },
  ];

  const ipConfig = {
    data: ipData,
    xField: "date",
    yField: "totalIPs",
    columnWidthRatio: 0.5,
    style: {
      fill: () => "#003c2f", // ✅ ALL bars in dark green now
    },
    label: {
      position: "middle",
      style: {
        fill: "#fff",
        fontSize: 12,
      },
    },
    xAxis: {
      label: {
        rotate: -45,
        style: { fontSize: 10 },
      },
    },
    meta: {
      date: { alias: "Date" },
      totalIPs: { alias: "Total IPs" },
    },
  };

  const columns = [
    {
      title: "Task Image",
      dataIndex: "taskImage",
      key: "taskImage",
      render: (url) => (
        <img
          src={url || ""}
          alt="task"
          style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Summary",
      dataIndex: "taskSummary",
      key: "taskSummary",
      render: (text) => (
        <span style={{ fontWeight: 500 }}>{text.slice(0, 50)}...</span>
      ),
    },
    {
      title: "Assignee",
      dataIndex: "assignee",
      key: "assignee",
    },
    {
      title: "Start",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
  ];
  const dataSource = [
    {
      key: 1,
      taskImage:
        "https://img.freepik.com/free-vector/3d-cartoon-style-checklist-with-green-checkmark-icon-list-with-completed-tasks-white-background-flat-vector-illustration-success-productivity-management-achievement-concept_778687-983.jpg?ga=GA1.1.1696791716.1743911361&semt=ais_hybrid&w=740",
      taskSummary: "Fix login API and ensure role-based auth works.",

      assignee: "Umer Farooq",
      startDate: new Date("2025-04-15"),
      deadline: new Date("2025-04-20"),
      duration: "5 days",
    },
    {
      key: 2,
      taskImage:
        "https://img.freepik.com/free-vector/3d-cartoon-style-checklist-with-green-checkmark-icon-list-with-completed-tasks-white-background-flat-vector-illustration-success-productivity-management-achievement-concept_778687-983.jpg?ga=GA1.1.1696791716.1743911361&semt=ais_hybrid&w=740",
      taskSummary: "Design dashboard UI for admin panel.",
      assignee: "Fatima Noor",
      startDate: new Date("2025-04-17"),
      deadline: new Date("2025-04-22"),
      duration: "5 days",
    },
    {
      key: 3,
      taskImage:
        "https://img.freepik.com/free-vector/3d-cartoon-style-checklist-with-green-checkmark-icon-list-with-completed-tasks-white-background-flat-vector-illustration-success-productivity-management-achievement-concept_778687-983.jpg?ga=GA1.1.1696791716.1743911361&semt=ais_hybrid&w=740",
      taskSummary: "Integrate chat feature with Socket.io",
      assignee: "Ali Raza",
      startDate: new Date("2025-04-18"),
      deadline: new Date("2025-04-23"),
      duration: "5 days",
    },
    {
      key: 4,
      taskImage:
        "https://img.freepik.com/free-vector/3d-cartoon-style-checklist-with-green-checkmark-icon-list-with-completed-tasks-white-background-flat-vector-illustration-success-productivity-management-achievement-concept_778687-983.jpg?ga=GA1.1.1696791716.1743911361&semt=ais_hybrid&w=740",
      taskSummary: "Integrate chat feature with Socket.io",
      assignee: "Ali Raza",
      startDate: new Date("2025-04-18"),
      deadline: new Date("2025-04-23"),
      duration: "5 days",
    },
  ];

  return (
    <div className="overview-containsser">
      <DateTimeDisplay />
      <br />
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={8}>
          <Card className="dash-card dash-purple">
            <div className="dash-stat-flex">
              <img src={ComputerIcon} alt="icon" className="dash-stat-icon" />
              <Statistic title="Total Sessions" value={"242.65K"} />
            </div>
            <p className="dash-sub">From the running month</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="dash-card dash-blue">
            <div className="dash-stat-flex">
              <img src={ComputerClick} alt="icon" className="dash-stat-icon" />
              <Statistic title="Total Clicks" value={"334"} />
            </div>
            <p className="dash-sub">Daily Earning of this month</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="dash-card dash-green">
            <div className="dash-stat-flex">
              <img src={ComputerPoints} alt="icon" className="dash-stat-icon" />
              <Statistic title="Total Sessions" value={"242.65K"} />
            </div>
            <p className="dash-sub">+6.04% from last month</p>
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]} style={{ marginTop: 20 }}>
        <Col xs={24} md={16}>
          <Card className="dash-card">
            <div className="card-header">
              <span style={{ fontWeight: "bold" }}>Monthly IPs</span>
              <Button className="dash-export-btn">Export</Button>
            </div>
            <div className="chart-placeholder" style={{ height: 300 }}>
              <Column {...ipConfig} />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="dash-card">
            <h3>More Analysis</h3>
            <p>There are more to view</p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button className="dash-list-btn">
                My Tasks <ArrowRightOutlined />
              </Button>
              <Button className="dash-list-btn">
                Upload Work <ArrowRightOutlined />
              </Button>
            </div>
            <p className="dash-credit">
              <img
                src="https://img.freepik.com/free-vector/dark-analytics-concept-illustration_114360-1813.jpg?t=st=1745070569~exp=1745074169~hmac=159c0c52330d77f35d8d9b09bdbb57d707f265b2e1cc7c1f90f2418f44cf97c8&w=740"
                alt="logo"
              />
            </p>
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]} style={{ marginTop: 20 }}>
        <Col xs={24} md={24}>
          <Card className="dash-card">
            <div className="card-header">
              <span style={{ fontWeight: "bold" }}>Recent Tasks</span>
              <Button className="dash-share-btn">Share</Button>
            </div>
            <Table
              className="dash-store-table"
              dataSource={dataSource}
              columns={columns}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserDashboard;
