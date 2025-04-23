import React, { useEffect, useState } from "react";
import { Card, Table, Typography, Spin, Alert } from "antd";
import axios from "axios";
import "../../styles/SmartProxyAnalytics.css";

const { Title } = Typography;

const SmartProxy = () => {
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = "your_username"; // Replace with your SmartProxy username
  const password = "your_password"; // Replace with your SmartProxy password

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        const response = await axios.get(
          "https://scraper-api.smartproxy.com/v1/stats",
          {
            auth: {
              username: username,
              password: password,
            },
          }
        );
        setUsageData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsageData();
  }, []);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Requests",
      dataIndex: "requests",
      key: "requests",
    },
    {
      title: "Success Rate",
      dataIndex: "success_rate",
      key: "success_rate",
      render: (rate) => `${(rate * 100).toFixed(2)}%`,
    },
    {
      title: "Traffic (GB)",
      dataIndex: "traffic",
      key: "traffic",
      render: (traffic) => (traffic / 1024).toFixed(2),
    },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div className="analytics-container">
      <Title level={2} className="analytics-title">
        SmartProxy Usage Analytics
      </Title>
      <Card className="analytics-card">
        <Table
          dataSource={usageData}
          columns={columns}
          rowKey="date"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default SmartProxy;
