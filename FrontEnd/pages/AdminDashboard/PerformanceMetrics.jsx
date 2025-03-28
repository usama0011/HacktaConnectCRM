import React from "react";
import { Card, Progress, Row, Col, Table } from "antd";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import "../../styles/PerformanceMetrics.css";

const PerformanceMetrics = () => {
  // Dummy data for performance statistics
  const performanceStats = [
    { key: "1", metric: "Task Completion Rate", value: "85%", progress: 85 },
    { key: "2", metric: "User Engagement", value: "75%", progress: 75 },
    { key: "3", metric: "Response Time", value: "4.2s", progress: 60 },
    { key: "4", metric: "System Uptime", value: "99.9%", progress: 95 },
  ];

  // Dummy data for performance graphs
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Tasks Completed",
        data: [60, 75, 85, 80, 90, 95, 100],
        borderColor: "#1890ff",
        backgroundColor: "rgba(24, 144, 255, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: ["Admin", "User", "Super Admin"],
    datasets: [
      {
        label: "Activity Level",
        data: [80, 60, 90],
        backgroundColor: ["#1890ff", "#52c41a", "#f5222d"],
      },
    ],
  };

  // Table Columns
  const columns = [
    { title: "Metric", dataIndex: "metric", key: "metric" },
    { title: "Value", dataIndex: "value", key: "value" },
    {
      title: "Performance",
      dataIndex: "progress",
      key: "progress",
      render: (progress) => (
        <Progress percent={progress} strokeColor="#032212" />
      ),
    },
  ];

  return (
    <div className="Performance-container">
      <h2 className="Performance-title">Performance Metrics Overview</h2>

      <Row gutter={[24, 24]}>
        {/* Performance Statistics Table */}
        <Col xs={24} md={12}>
          <Card className="Performance-card">
            <h3>Performance Statistics</h3>
            <Table
              columns={columns}
              dataSource={performanceStats}
              pagination={false}
            />
          </Card>
        </Col>

        {/* Line Chart for Performance Over Time */}
        <Col xs={24} md={12}>
          <Card className="Performance-card">
            <h3>Performance Over Time</h3>
            <Line data={lineChartData} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        {/* Bar Chart for Activity Levels */}
        <Col xs={24} md={12}>
          <Card className="Performance-card">
            <h3>User Activity Levels</h3>
            <Bar data={barChartData} />
          </Card>
        </Col>

        {/* Extra Information */}
        <Col xs={24} md={12}>
          <Card className="Performance-card">
            <h3>Key Insights</h3>
            <ul className="Performance-list">
              <li>
                🚀 **85%** Task Completion Rate indicates high efficiency.
              </li>
              <li>
                📉 Average **Response Time** is **4.2 seconds**, optimizing for
                performance.
              </li>
              <li>
                🟢 **System Uptime** is **99.9%**, ensuring maximum reliability.
              </li>
              <li>📊 **User Engagement** is steadily improving at **75%**.</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PerformanceMetrics;
