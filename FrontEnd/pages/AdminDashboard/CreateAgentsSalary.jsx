import React from "react";
import { Card, Col, Row } from "antd";
import "../../styles/AgentSalaryAggrigation.css";
import ProxyIcon from "../../src/assets/proxy.png";
import MoneyIcon from "../../src/assets/money.png";
import SheetIcon from "../../src/assets/sheet.png";
import UserIcons from "../../src/assets/team.png";
import PointsIcon from "../../src/assets/point.png";
import InsigntsIcon from "../../src/assets/Insights.png";
const reportCards = [
  {
    title: "Salary Reports",
    subtitle: "Download Salary Sheet",
    icon: <img src={MoneyIcon} alt="icon" />,
    link: "/reports/salary",
  },
  {
    title: "Attendance Reports",
    subtitle: "Download Attendance Sheet",
    icon: <img src={SheetIcon} alt="icon" />,
    link: "/reports/attendance",
  },
  {
    title: "QC Points Reports",
    subtitle: "Download QC Points Summary",
    icon: <img src={PointsIcon} alt="icon" />,
    link: "/reports/qcpoints",
  },
  {
    title: "Registered Users",
    subtitle: "Export All Registered Users",
    icon: <img src={UserIcons} alt="icon" />,
    link: "/reports/users",
  },
  {
    title: "Agents IP Reports",
    subtitle: "Export IP Sessions & Clicks",
    icon: <img src={InsigntsIcon} alt="icon" />,
    link: "/reports/agentips",
  },
  {
    title: "Proxy Reports",
    subtitle: "Download Proxy Usage Log",
    icon: <img src={ProxyIcon} alt="icon" />,
    link: "/reports/proxy",
  },
];

const AgentSalaryAggrigation = () => {
  return (
    <div className="aggrigation-container">
      <Row gutter={[24, 24]}>
        {reportCards.map((card, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <a href={card.link}>
              <Card className="aggrigation-card" hoverable>
                <div className="aggrigation-icon">{card.icon}</div>
                <div className="aggrigation-info">
                  <h3 className="aggrigation-card-title">{card.title}</h3>
                  <p className="aggrigation-card-subtitle">{card.subtitle}</p>
                </div>
              </Card>
            </a>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AgentSalaryAggrigation;
