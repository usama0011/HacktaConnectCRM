import React, { useEffect, useState } from "react";
import { Spin, Card, Typography, Progress, Row, Col, message } from "antd";
import {
  DatabaseOutlined,
  DownloadOutlined,
  CloudOutlined,
} from "@ant-design/icons";
import { Pie } from "@ant-design/plots";
import "../../styles/mangoproxy.css";
import API from "../../utils/BaseURL";

import TrafficUIIcon from "../../src/assets/Insights.png";
import ChartIcon from "../../src/assets/chartup.png";

const MangoProxy = () => {
  const [trafficData, setTrafficData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchMangoData = async () => {
      try {
        const trafficRes = await API.get("/mangoproxy/traffic");
        setTrafficData(trafficRes.data);

        setTimeout(() => {
          if (trafficRes.data) {
            const totalGB = (trafficRes.data.totalMB || 0) / 1024;
            const usedGB = (trafficRes.data.usedMB || 0) / 1024;
            const availableGB = (trafficRes.data.availableMB || 0) / 1024;
            setPieData([
              { type: "Used", value: parseFloat(usedGB.toFixed(2)) || 0.01 },
              {
                type: "Available",
                value: parseFloat(availableGB.toFixed(2)) || 0.01,
              },
            ]);
          }
        }, 1000);
      } catch (error) {
        console.error("Error fetching MangoProxy traffic:", error);
        message.error("Failed to load MangoProxy traffic.");
      } finally {
        setLoading(false);
      }
    };
    fetchMangoData();
  }, []);

  if (loading) {
    return (
      <div className="mangoproxy-container">
        <Spin size="large" tip="Loading MangoProxy Traffic Data..." />
      </div>
    );
  }

  const totalGB = (trafficData?.totalMB || 0) / 1024;
  const usedGB = (trafficData?.usedMB || 0) / 1024;
  const availableGB = (trafficData?.availableMB || 0) / 1024;
  const usedPercent = totalGB ? (usedGB / totalGB) * 100 : 0;

  const pieConfig = {
    data: pieData,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "spider",
      content: "{type}: {value} GB",
    },
    legend: {
      position: "right",
    },
    height: 350,
    interactions: [{ type: "element-active" }],
  };

  return (
    <div className="mangoproxy-container">
      <h1 className="mangoproxy-heading">Mango Proxy Dashboard</h1>

      <Row gutter={24}>
        {/* Traffic Usage Card */}
        <Col xs={24} md={12}>
          <Card className="mangoproxy-card">
            <div className="mangoproxy-card-header">
              <img
                src={TrafficUIIcon}
                alt="Traffic Icon"
                className="mangoproxy-icon"
              />
              <h2>Traffic Usage</h2>
            </div>
            <div className="mangoproxy-stats">
              <p>
                <DatabaseOutlined /> <strong>Total Traffic:</strong>{" "}
                {totalGB.toFixed(2)} GB
              </p>
              <p>
                <DownloadOutlined /> <strong>Used Traffic:</strong>{" "}
                {usedGB.toFixed(2)} GB
              </p>
              <p>
                <CloudOutlined /> <strong>Available Traffic:</strong>{" "}
                {availableGB.toFixed(2)} GB
              </p>
            </div>
            <Progress
              percent={usedPercent.toFixed(2)}
              status="active"
              strokeColor={{
                from: "#108ee9",
                to: "#87d068",
              }}
            />
          </Card>
        </Col>

        {/* Traffic Distribution Card */}
        <Col xs={24} md={12}>
          <Card className="mangoproxy-card">
            <div className="mangoproxy-card-header">
              <img
                src={ChartIcon}
                alt="Chart Icon"
                className="mangoproxy-icon"
              />
              <h2>Traffic Distribution</h2>
            </div>
            {pieData.length > 0 ? (
              <Pie {...pieConfig} />
            ) : (
              <Spin tip="Loading Chart..." />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MangoProxy;
