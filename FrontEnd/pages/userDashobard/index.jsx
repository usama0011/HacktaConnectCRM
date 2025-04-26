import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Avatar,
  Button,
  DatePicker,
  Progress,
  Table,
} from "antd";
import dayjs from "dayjs";

import {
  RiseOutlined,
  DollarCircleOutlined,
  BarChartOutlined,
  UserOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import "../../styles/UserDashboard.css";
const { RangePicker } = DatePicker;

import DateTimeDisplay from "../../components/DateTimeDisplay";
import ComputerIcon from "../../src/assets/computer.png";
import ComputerClick from "../../src/assets/click.png";
import ComputerPoints from "../../src/assets/point.png";
import { Column } from "@ant-design/plots";
import axios from "axios";

const UserDashboard = () => {
  const [selectedRange, setSelectedRange] = React.useState([]);
  const [recentTasks, setRecentTasks] = useState([]);

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
      title: "Image",
      dataIndex: "taskImage",
      key: "taskImage",
      render: (url) => (
        <img
          src={url || "https://via.placeholder.com/40"}
          alt="task"
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            objectFit: "cover",
            border: "1px solid #f0f0f0",
          }}
        />
      ),
    },
    {
      title: "Summary",
      dataIndex: "taskSummary",
      key: "taskSummary",
      render: (text) => (
        <span
          style={{
            fontWeight: 500,
            maxWidth: 220,
            display: "inline-block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={text}
        >
          {text || "No summary"}
        </span>
      ),
    },
    {
      title: "Assignee",
      dataIndex: "assignee",
      key: "assignee",
      render: (name) => <span style={{ fontWeight: 500 }}>{name}</span>,
    },
    {
      title: "Start",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("en-GB") : "—",
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("en-GB") : "—",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (text) => <span>{text || "—"}</span>,
    },
  ];

  useEffect(() => {
    const fetchRecentTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tasks/all"); // your GET all tasks endpoint
        const latestFive = res.data.slice(0, 5); // just pick first 5 (already sorted from backend)
        setRecentTasks(latestFive);
        console.log(latestFive);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchRecentTasks();
  }, []);
  return (
    <div className="overview-containsser">
      <DateTimeDisplay />
      <br />
      <div style={{ marginTop: 10, marginBottom: 20 }}>
        <RangePicker
          onChange={(dates) => setSelectedRange(dates)}
          format="MMM DD, YYYY"
          style={{ width: "100%", maxWidth: 500 }}
          separator="→"
          presets={[
            {
              label: "This Week",
              value: [dayjs().startOf("week"), dayjs().endOf("week")],
            },
            {
              label: "Last Week",
              value: [
                dayjs().subtract(1, "week").startOf("week"),
                dayjs().subtract(1, "week").endOf("week"),
              ],
            },
            {
              label: "This Month",
              value: [dayjs().startOf("month"), dayjs().endOf("month")],
            },
            {
              label: "Last Month",
              value: [
                dayjs().subtract(1, "month").startOf("month"),
                dayjs().subtract(1, "month").endOf("month"),
              ],
            },
          ]}
          allowClear
          showTime={false}
          defaultPickerValue={[dayjs().subtract(1, "month"), dayjs()]}
          picker="date"
          placement="bottomLeft"
          disabledDate={(current) => current && current > dayjs().endOf("day")}
          getPopupContainer={(trigger) => trigger.parentNode}
          // 👇 Display 2 months side-by-side
          panelRender={(panelNode) => (
            <div style={{ display: "flex", gap: 20 }}>{panelNode}</div>
          )}
        />
      </div>

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
      <Table
        className="dash-store-table"
        dataSource={recentTasks.map((task, index) => ({
          key: index,
          taskImage: task.taskImage,
          taskSummary: task.taskSummary,
          assignee: task.assignee,
          startDate: new Date(task.startDate).toLocaleDateString(),
          deadline: new Date(task.deadline).toLocaleDateString(),
          duration: task.duration,
        }))}
        columns={columns}
        pagination={false}
      />
    </div>
  );
};

export default UserDashboard;
