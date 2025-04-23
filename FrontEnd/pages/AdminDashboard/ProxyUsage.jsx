import React from "react";
import { Card, Row, Col, Typography, Button, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import { CrownOutlined } from "@ant-design/icons";
import "../../styles/ProxyUsage.css";

const { Title, Text } = Typography;

const ProxyUsage = () => {
  const navigate = useNavigate();

  const proxies = [
    {
      platform: "SmartProxy",
      totalUsage: 50,
      color: "#4a6cf7",
      route: "/admin/dashboard/proxy/smart",
      proxyURL:
        "https://images.smartproxy.com/smartproxy_logo_t_0b8821572f/smartproxy_logo_t_0b8821572f.png",
      image:
        "https://img.freepik.com/free-vector/wireframe-chain-with-digital-code-lock-blockchain-cyber-security-safe-privacy-concept_127544-953.jpg?ga=GA1.1.1696791716.1743911361&semt=ais_hybrid&w=740", // Image URL left empty for later
    },
    {
      platform: "MangoProxy",
      totalUsage: 35,
      color: "#facc15",
      route: "/admin/dashboard/proxy/mango",
      proxyURL:
        "https://images.smartproxy.com/smartproxy_logo_t_0b8821572f/smartproxy_logo_t_0b8821572f.png",
      image:
        "https://img.freepik.com/free-vector/wireframe-chain-with-digital-code-lock-blockchain-cyber-security-safe-privacy-concept_127544-953.jpg?ga=GA1.1.1696791716.1743911361&semt=ais_hybrid&w=740",
    },
    {
      platform: "Geonode",
      totalUsage: 42,
      color: "#a855f7",
      route: "/admin/dashboard/proxy/geo",
      proxyURL:
        "https://images.smartproxy.com/smartproxy_logo_t_0b8821572f/smartproxy_logo_t_0b8821572f.png",
      image:
        "https://img.freepik.com/free-vector/wireframe-chain-with-digital-code-lock-blockchain-cyber-security-safe-privacy-concept_127544-953.jpg?ga=GA1.1.1696791716.1743911361&semt=ais_hybrid&w=740",
    },
  ];

  return (
    <div className="proxy-dashboard-container">
      <div className="CRM-leaderboard-ribbon">
        <div className="CRM-ribbon-left" />
        <div className="CRM-ribbon-center">PROXY USAGE</div>
        <div className="CRM-ribbon-right" />
      </div>
      <br />
      <Row gutter={[24, 24]}>
        {proxies.map((proxy, idx) => (
          <Col xs={24} sm={12} md={8} key={idx}>
            <Card className="CRM-overview-card" hoverable>
              <img
                src={proxy.image}
                alt={proxy.platform}
                className="proxy-img"
              />
              <div className="CRM-card-content">
                <div className="CRM-card-text">
                  <p className="CRM-card-title">{proxy.platform}</p>
                  <h2 className="CRM-card-value">{proxy.totalUsage} GB</h2>
                  <p className="CRM-card-change CRM-positive">
                    Daily Usage: 12AM - 12PM
                  </p>
                </div>
                <Avatar src={proxy.image} size={48} />
              </div>
              <div className="CRM-card-banner">
                <div className="CRM-banner-left">
                  <Avatar
                    className="CRM-banner-avatar"
                    src={proxy.image}
                    alt="avatar"
                  />
                  <span className="CRM-banner-name">{proxy.platform}</span>
                </div>
                <div className="CRM-banner-points">
                  <span className="CRM-points-icon">🪙</span>
                  <span className="CRM-banner-score">
                    {proxy.totalUsage} GB
                  </span>
                </div>
              </div>
              <Button
                type="primary"
                className="proxy-view-btn"
                onClick={() => navigate(proxy.route)}
              >
                Full Report
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProxyUsage;
