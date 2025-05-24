import React, { useContext, useEffect, useState } from "react";
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

import { useUserContext } from "../../context/UserContext";
import API from "../../utils/BaseURL";
import { Calendar } from "primereact/calendar";
const UserDashboard = () => {
  const [selectedRange, setSelectedRange] = React.useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [cardStats, setCardStats] = useState(null);
  const [monthlyIPs, setMonthlyIPs] = useState([]);

  const { user } = useUserContext();
  console.log(user._id);

  const ipConfig = {
    data: monthlyIPs.map((item) => ({
      date: dayjs(item.date, "D-M-YYYY").format("MMM DD"), // format nicely
      totalIPs: item.totalIPs,
    })),
    xField: "date",
    yField: "totalIPs",
    columnWidthRatio: 0.5,
    style: {
      fill: () => "#003c2f",
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
        const res = await API.get(`/tasks/user/${user.username}`);
        const latestFive = res.data.slice(0, 5);
        setRecentTasks(latestFive);
      } catch (error) {
        console.error("Error fetching user tasks:", error);
      }
    };

    const fetchCardStats = async () => {
      try {
        const res = await API.get(`/ip/getcardssummery/${user._id}`, {
          params: {
            year: dayjs().format("YYYY"),
            month: dayjs().format("MM"),
          },
        });
        setCardStats(res.data);
        console.log("Card stats:", res.data);
      } catch (error) {
        console.error("Error fetching card stats:", error);
      }
    };
    const fetchMonthlyIPs = async () => {
      try {
        const res = await API.get(`/ip/monthlyips/${user._id}`, {
          params: {
            year: dayjs().format("YYYY"),
            month: dayjs().format("MM"),
          },
        });
        setMonthlyIPs(res.data);
        console.log("Monthly IPs:", res.data);
      } catch (error) {
        console.error("Error fetching monthly IPs:", error);
      }
    };

    if (user?._id) {
      fetchRecentTasks();
      fetchCardStats(); // 👈 fetch cards after user is loaded
      fetchMonthlyIPs(); // 👈 Fetch the new chart data
    }
  }, [user]);

  return (
    <div className="overview-containsser">
      <DateTimeDisplay />
      <br />
      <div style={{ marginTop: 10, marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems:'center',
            gap: "12px",
            flexWrap: "wrap",
            maxWidth: 500,
          }}
        >
          <Calendar
            value={selectedRange[0]?.toDate?.() || null}
            onChange={(e) =>
              setSelectedRange([dayjs(e.value), selectedRange?.[1] || null])
            }
            maxDate={new Date()}
            dateFormat="M dd, yy"
            placeholder="Start Date"
            showIcon
            className="range-calendar"
          />
          <span style={{ alignSelf: "center" }}>→</span>
          <Calendar
            value={selectedRange[1]?.toDate?.() || null}
            onChange={(e) =>
              setSelectedRange([selectedRange?.[0] || null, dayjs(e.value)])
            }
            minDate={selectedRange?.[0]?.toDate?.() || null}
            maxDate={new Date()}
            dateFormat="M dd, yy"
            placeholder="End Date"
            showIcon
            className="range-calendar"
          />
        </div>
      </div>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={8}>
          <Card className="dash-card dash-purple">
            <div className="dash-stat-flex">
              <img src={ComputerIcon} alt="icon" className="dash-stat-icon" />
              <Statistic
                title="Total Sessions"
                value={cardStats ? cardStats.sessions.current : 0}
              />
            </div>
            <p className="dash-sub">
              last month {cardStats?.sessions.lastMonth || 0}{" "}
              {cardStats?.sessions.up ? (
                <RiseOutlined style={{ color: "green" }} />
              ) : (
                <BarChartOutlined style={{ color: "red" }} />
              )}
            </p>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card className="dash-card dash-blue">
            <div className="dash-stat-flex">
              <img src={ComputerClick} alt="icon" className="dash-stat-icon" />
              <Statistic
                title="Total Clicks"
                value={cardStats ? cardStats.clicks.current : 0}
              />
            </div>
            <p className="dash-sub">
              last month {cardStats?.clicks.lastMonth || 0}{" "}
              {cardStats?.clicks.up ? (
                <RiseOutlined style={{ color: "green" }} />
              ) : (
                <BarChartOutlined style={{ color: "red" }} />
              )}
            </p>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card className="dash-card dash-green">
            <div className="dash-stat-flex">
              <img src={ComputerPoints} alt="icon" className="dash-stat-icon" />
              <Statistic
                title="Total IPs"
                value={cardStats ? cardStats.ips.current : 0}
              />
            </div>
            <p className="dash-sub">
              last month {cardStats?.ips.lastMonth || 0}{" "}
              {cardStats?.ips.up ? (
                <RiseOutlined style={{ color: "green" }} />
              ) : (
                <BarChartOutlined style={{ color: "red" }} />
              )}
            </p>
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
            <div className="morealnalysisclas">
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
    </div>
  );
};

export default UserDashboard;
