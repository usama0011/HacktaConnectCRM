// src/components/RightDashboardPanel.jsx
import React, { useEffect, useState } from "react";
import { Card, List, Avatar, Button } from "antd";
import {
  CrownOutlined,
  InboxOutlined,
  UserOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import "../styles/RightDashboardPanel.css";
import { useNavigate } from "react-router-dom";

const RightDashboardPanel = () => {
  const [topPerformers, setTopPerformers] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopPerformers = async () => {
      try {
        const now = new Date();
        const res = await axios.get(
          "http://localhost:5000/api/qcpoints/monthly-summary",
          {
            params: {
              year: now.getFullYear(),
              month: now.getMonth() + 1, // month is 0-based in JS
            },
          }
        );
        setTopPerformers(res.data.top5);
      } catch (err) {
        console.error("Error fetching top performers:", err);
      }
    };

    const fetchRecentWork = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/ip/");
        setRecentSubmissions(res.data.ipRecords);
      } catch (err) {
        console.error("Error fetching recent submissions:", err);
      }
    };

    fetchTopPerformers();
    fetchRecentWork();
  }, []);

  return (
    <div className="right-dashboard-panel">
      <Card
        title={<span>🏆 Top 5 Performers</span>}
        className="panel-card"
        bordered={false}
      >
        <List
          itemLayout="horizontal"
          dataSource={topPerformers}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{ border: "2px solid white" }}
                    src={item.avatar}
                    icon={<UserOutlined />}
                  />
                }
                title={
                  <span>
                    <UserOutlined style={{ marginRight: 5 }} />
                    {item.name}
                  </span>
                }
                description={
                  <span style={{ color: "white" }}>
                    <CheckCircleOutlined
                      style={{ marginRight: 5, color: "#52c41a" }}
                    />
                    Total Points: <strong>{item.totalPoints}</strong>
                  </span>
                }
              />
            </List.Item>
          )}
        />

        <Button
          type="link"
          onClick={() => navigate("/admin/dashboard/AllQCPoints")}
        >
          View All
        </Button>
      </Card>

      <Card
        title={<span>🎯 Latest Work Submissions</span>}
        className="panel-card"
        bordered={false}
      >
        <List
          itemLayout="horizontal"
          dataSource={recentSubmissions}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={item.userId?.userImage || undefined}
                    icon={<UserOutlined />}
                  />
                }
                title={
                  <span style={{ textTransform: "capitalize" }}>
                    <UserOutlined style={{ marginRight: 5 }} />
                    {item.username}
                  </span>
                }
                description={
                  <div style={{ color: "white" }}>
                    <CheckCircleOutlined
                      style={{ marginRight: 5, color: "#52c41a" }}
                    />
                    Clicks: {item.clicks}
                    <br />
                    <CheckCircleOutlined
                      style={{ marginRight: 5, color: "#52c41a" }}
                    />
                    Sessions: {item.sessions}
                    <br />
                    <SyncOutlined
                      style={{ marginRight: 5, color: "#faad14" }}
                    />
                    Status:{" "}
                    <span
                      className={`status-text ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                    <br />
                    <ClockCircleOutlined
                      style={{ marginRight: 5, color: "#496cf7" }}
                    />
                    Time:{" "}
                    <span
                      className={`status-texts ${item.status.toLowerCase()}`}
                    >
                      {moment(item.createdAt).calendar()}
                    </span>
                  </div>
                }
              />
            </List.Item>
          )}
        />

        <Button
          type="link"
          onClick={() => navigate("/admin/dashboard/AllQCPoints")}
        >
          View All
        </Button>
      </Card>
    </div>
  );
};

export default RightDashboardPanel;
