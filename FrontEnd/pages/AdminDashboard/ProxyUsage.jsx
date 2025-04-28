import React from "react";
import { Card, Row, Col, Typography, Button, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
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
      proxyURL: "",
      image:
        "https://img.freepik.com/free-vector/wireframe-chain-with-digital-code-lock-blockchain-cyber-security-safe-privacy-concept_127544-953.jpg",
      proxyavataermsla:
        "https://s3-eu-west-1.amazonaws.com/tpd/logos/5d89308558ce38000114f334/0x0.png",
    },
    {
      platform: "MangoProxy",
      totalUsage: 35,
      color: "#facc15",
      route: "/admin/dashboard/proxy/mango",
      proxyURL: "",
      image:
        "https://img.freepik.com/free-vector/wireframe-chain-with-digital-code-lock-blockchain-cyber-security-safe-privacy-concept_127544-953.jpg",
      proxyavataermsla:
        "https://s3-eu-west-1.amazonaws.com/tpd/logos/643b8f60746aa1e4120197d4/0x0.png",
    },
    {
      platform: "Geonode",
      totalUsage: 42,
      color: "#a855f7",
      route: "/admin/dashboard/proxy/geo",
      proxyURL: "",
      image:
        "https://img.freepik.com/free-vector/wireframe-chain-with-digital-code-lock-blockchain-cyber-security-safe-privacy-concept_127544-953.jpg",
      proxyavataermsla:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRco0Wy93F0phwqJqWh3-a3Ld0ZZ95TG3mEug&s",
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
              {/* Cover Big Image */}
              <div className="proxy-card-cover">
                <img
                  src={proxy.image}
                  alt={`${proxy.platform} Cover`}
                  className="proxy-cover-img"
                />
              </div>

              {/* Content Area */}
              <div className="proxy-card-content">
                <div className="proxy-card-text">
                  <p className="proxy-card-title">{proxy.platform}</p>
                  <h2 className="proxy-card-value">{proxy.totalUsage} GB</h2>
                  <p className="proxy-card-subtext">Daily Usage: 12AM - 12PM</p>
                </div>

                {/* Small Avatar */}
                <Avatar
                  src={proxy.proxyavataermsla}
                  size={50}
                  shape="circle"
                  className="proxy-avatar"
                />
              </div>

              {/* Button */}
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
