import "../../styles/InfaticaAPIDetails.css";
import { Pie } from "@ant-design/plots";
import React, { useEffect, useState } from "react";
import { Spin, Typography, Card, Row, Col, Descriptions, message } from "antd";
import {
  UserOutlined,
  CloudDownloadOutlined,
  CloudOutlined,
  BarChartOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import API from "../../utils/BaseURL";

const { Title } = Typography;

const InfaticaAPIDetails = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [pieData, setPieData] = useState([]);
  const [usedGB, setUsedGB] = useState(0);
  const [availableGB, setAvailableGB] = useState(0);
  const [limitGB, setLimitGB] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await API.get("/infatica/traffic-usage");
      setStats(response.data);
      message.success("Statistics loaded!");
    } catch (error) {
      console.error(error);
      message.error("Failed to load statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!stats) return;

    const usage = Number(stats?.usage || 0);
    const limit = Number(stats?.traffic_limit || 0);
    const used = usage / (1024 * 1024 * 1024);
    const available = (limit - usage) / (1024 * 1024 * 1024);
    const total = limit / (1024 * 1024 * 1024);

    setUsedGB(used);
    setAvailableGB(available);
    setLimitGB(total);

    const data = [
      {
        type: "Usage",
        value: parseFloat(used.toFixed(2)) || 0.01,
      },
      {
        type: "Available",
        value: parseFloat(available.toFixed(2)) || 0.01,
      },
      {
        type: "Total Limit",
        value: parseFloat(total.toFixed(2)) || 0.01,
      },
    ];

    setPieData(data);
  }, [stats]);

  const bytesToGB = (bytes) => {
    const number = Number(bytes);
    if (isNaN(number)) return "-";
    const gb = number / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  const getIconForKey = (key) => {
    const lower = key.toLowerCase();
    if (lower.includes("user"))
      return <UserOutlined style={{ color: "#1890ff" }} />;
    if (lower.includes("traffic") || lower.includes("download"))
      return <CloudDownloadOutlined style={{ color: "#52c41a" }} />;
    if (lower.includes("usage") || lower.includes("bandwidth"))
      return <BarChartOutlined style={{ color: "#722ed1" }} />;
    if (lower.includes("data"))
      return <DatabaseOutlined style={{ color: "#eb2f96" }} />;
    return <CloudOutlined style={{ color: "#aaa" }} />;
  };

  const pieConfig = {
    appendPadding: 10,
    data: pieData.filter((item) => item.type && item.value > 0),
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    innerRadius: 0.6,
    height: window.innerWidth <= 480 ? 240 : 300,
    scale: {
      color: {
        range: ["#1e2d7d", "#00c18c", "#a0d911"], // Usage, Available, Total
      },
    },
    label: {
      text: (d) => `${d.type}: ${d.value} GB`,
      position: "spider",
      style: {
        fontSize: 14,
        fontWeight: 500,
        fill: "#333",
      },
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
    tooltip: {
      formatter: (datum) => ({
        name: datum?.type || "Unknown",
        value: `${datum?.value ?? 0} GB`,
      }),
    },
    interactions: [{ type: "element-active" }],
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", paddingTop: "30px" }}>
      <Title level={2} style={{ textAlign: "center", color: "black" }}>
        Account Statistics
      </Title>

      {loading ? (
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <Spin size="large" />
        </div>
      ) : stats ? (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card bordered>
              <Descriptions title="General Stats" column={1}>
                {Object.entries(stats).map(([key, value], index) => (
                  <Descriptions.Item
                    key={index}
                    label={
                      <span>
                        {getIconForKey(key)}{" "}
                        <span style={{ marginLeft: 8 }}>{key}</span>
                      </span>
                    }
                  >
                    {typeof value === "object"
                      ? JSON.stringify(value)
                      : key.toLowerCase().includes("usage") ||
                        key.toLowerCase().includes("traffic") ||
                        key.toLowerCase().includes("data")
                      ? bytesToGB(value)
                      : value?.toString()}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </Card>
          </Col>

          <Col span={24} style={{ marginTop: 32 }}>
            <Card
              title="Traffic Distribution (Donut Chart)"
              className="infatica-card"
            >
              <div style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={8}>
                    <strong>Usage:</strong> {usedGB.toFixed(2)} GB
                  </Col>
                  <Col xs={24} sm={8}>
                    <strong>Available:</strong> {availableGB.toFixed(2)} GB
                  </Col>
                  <Col xs={24} sm={8}>
                    <strong>Total Limit:</strong> {limitGB.toFixed(2)} GB
                  </Col>
                </Row>
              </div>

              <div className="donut-chart-wrapper">
                {pieData.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#888" }}>
                    No usage data available to render chart.
                  </p>
                ) : (
                  <Pie {...pieConfig} />
                )}
              </div>
            </Card>
          </Col>
        </Row>
      ) : (
        <p style={{ textAlign: "center", color: "#888" }}>
          No statistics available.
        </p>
      )}
      <br />
    </div>
  );
};

export default InfaticaAPIDetails;
