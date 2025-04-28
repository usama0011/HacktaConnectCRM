import React from "react";
import { Card, Row, Col, Button } from "antd";
import "../styles/RecordsDashboard.css";
import { useNavigate } from "react-router-dom";
import AllAgentImage from "../src/assets/team.png";

const RecordsDashboard = () => {
  const navigate = useNavigate();
  const records = [
    {
      title: "Agents Record",
      description:
        "View and manage all agent activity, attendance, salary, and reports in one place.",
      image: <img src={AllAgentImage} />, // Icon URL leave blank for now
      buttonText: "View Agents",
      route: "/admin/dashboard/allagentrecord",
    },
    {
      title: "Management Record",
      description:
        "Access management reports, system logs, and administrative operations efficiently.",
      image: <img src={AllAgentImage} />, // Icon URL leave blank
      buttonText: "View Management",
      route: "/admin/dashboard/allmangemenrerecord",
    },
  ];

  return (
    <div className="records-dashboard-container">
      <h1 className="records-dashboard-heading">Records Dashboard</h1>
      <Row gutter={[24, 24]} justify="center">
        {records.map((record, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card className="record-card" hoverable>
              <div className="record-card-icon">{record.image}</div>
              <h2 className="record-card-title">{record.title}</h2>
              <p className="record-card-description">{record.description}</p>
              <Button
                onClick={() => navigate(`${record.route}`)}
                type="primary"
                className="record-card-btn"
              >
                {record.buttonText}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RecordsDashboard;
