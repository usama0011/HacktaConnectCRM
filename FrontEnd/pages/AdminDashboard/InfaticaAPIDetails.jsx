import React, { useEffect, useState } from "react";
import {
  Typography,
  Input,
  Select,
  Button,
  Table,
  Spin,
  message,
  Card,
  Row,
  Col,
} from "antd";
import { Pie } from "@ant-design/plots";
import { CloudOutlined } from "@ant-design/icons";
import "../../styles/InfaticaAPIDetails.css";
import axios from "axios";

const { Title } = Typography;
const { Option } = Select;

const InfaticaAPIDetails = () => {
  const [key, setKey] = useState("");
  const [period, setPeriod] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [usageData, setUsageData] = useState([]);
  const [chartData, setChartData] = useState([]);

  const fetchTrafficUsage = async () => {
    if (!key || !period) {
      message.error("Please provide both Package Key and Period.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("key", key);
      formData.append("period", period);

      const response = await axios.post("https://infatica-dashboard-backend.vercel.app/api/stats/traffic-usage", formData);

      const parsed = [];
      const regionTotals = {};

      Object.entries(response.data || {}).forEach(([region, usage]) => {
        let totalRegionBytes = 0;

        Object.entries(usage).forEach(([time, value]) => {
          parsed.push({
            key: `${region}-${time}`,
            region,
            time,
            usage: value,
          });
          totalRegionBytes += value;
        });

        regionTotals[region] = (regionTotals[region] || 0) + totalRegionBytes;
      });

      const pieReady = Object.entries(regionTotals).map(([region, total]) => ({
        type: region,
        value: parseFloat((total / (1024 * 1024)).toFixed(2)), // MB
      }));

      setUsageData(parsed);
      setChartData(pieReady);
      message.success("Traffic usage data fetched successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch traffic usage data!");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "📍 Region",
      dataIndex: "region",
      key: "region",
    },
    {
      title: "🕒 Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "📶 Usage (Bytes)",
      dataIndex: "usage",
      key: "usage",
    },
  ];

  const pieConfig = {
    appendPadding: 10,
    data: chartData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    height: 300,
    scale: {
      color: {
        range: ["#003c2f", "#007f5c", "#00a86b", "#00c18c"],
      },
    },
    label: {
      text: (d) => `${d.type}: ${d.value} MB`,
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
        value: `${datum?.value ?? 0} MB`,
      }),
    },
    interactions: [{ type: "element-active" }],
  };

  return (
    <div className="infatica-container">
      <Title level={3} className="infatica-title">
        <CloudOutlined /> Traffic Usage – Infatica
      </Title>

      <Input
        placeholder="Enter Package Key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="infatica-input"
      />

      <Select
        value={period}
        onChange={(val) => setPeriod(val)}
        className="infatica-select"
        placeholder="Select Period"
      >
        <Option value="daily">Daily</Option>
        <Option value="weekly">Weekly</Option>
        <Option value="monthly">Monthly</Option>
        <Option value="all">All</Option>
      </Select>

      <Button
        type="primary"
        onClick={fetchTrafficUsage}
        loading={loading}
        className="infatica-button"
      >
        {loading ? <Spin /> : "Fetch Traffic Usage"}
      </Button>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Usage Table" className="infatica-card">
            {loading ? (
              <Spin />
            ) : usageData.length > 0 ? (
              <Table
                dataSource={usageData}
                columns={columns}
                pagination={{ pageSize: 6 }}
                bordered
              />
            ) : (
              <p style={{ color: "#888" }}>No traffic data fetched yet.</p>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Usage by Region (MB)" className="infatica-card">
            {chartData.length > 0 ? (
              <Pie {...pieConfig} />
            ) : (
              <Spin tip="Preparing Chart..." />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InfaticaAPIDetails;
