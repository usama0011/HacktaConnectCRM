import React from "react";
import { Card, Row, Col, Button } from "antd";
import "../styles/RecordsDashboard.css";
import { useNavigate } from "react-router-dom";
import AllAgentImage from "../src/assets/team.png";
import FileUPloadAgent from "../src/assets/fileupload.png";
import ManagementAlso from "../src/assets/mana.png";

const RecordsDashboard = () => {
  const navigate = useNavigate();
  const records = [
    {
      title: "Agents Record",
      description:
        "View and manage all agent activity, attendance, salary, and reports in one place.",
      image: <img src={AllAgentImage} />, // Placeholder image
      buttonText: "View Agents",
      route: "/admin/dashboard/allagentrecord",
    },
    {
      title: "Management Record",
      description:
        "Access management reports, system logs, and administrative operations efficiently.",
      image: <img src={ManagementAlso} />, // Placeholder image
      buttonText: "View Management",
      route: "/admin/dashboard/allmangemenrerecord",
    },
    {
      title: "Upload CSV Record",
      description:
        "Upload agent data in CSV format to manage bulk attendance, performance, or salary info.",
      image: <img src={FileUPloadAgent} />, // Same placeholder, change if needed
      buttonText: "Upload CSV",
      route: "/admin/dashboard/agentcsv",
    },
    {
      title: "Upload IPs Data CSV",
      description: "Upload IP data via CSV for shift-based login tracking and IP assignment.",
      image: <img src={FileUPloadAgent} />,
      buttonText: "Upload IPs CSV",
      route: "/admin/dashboard/uploSIPCSV",
    },
    {
      title: "Upload QCPoints CSV",
      description: "Bulk upload QC Points data using CSV format for performance analysis.",
      image: <img src={FileUPloadAgent} />,
      buttonText: "Upload QCPoints CSV",
      route: "/admin/dashboard/qcpointscsv",
    },
    {
      title: "Upload Attendance CSV",
      description: "Upload daily or monthly attendance data via CSV for automated recordkeeping.",
      image: <img src={FileUPloadAgent} />,
      buttonText: "Upload Attendance CSV",
      route: "/admin/dashboard/uploadAttendanceCSV",
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
