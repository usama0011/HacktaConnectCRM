import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Button, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import "../../styles/ProxyUsage.css";
import API from "../../utils/BaseURL";

const { Title, Text } = Typography;

const ProxyUsage = () => {
  const navigate = useNavigate();
  const [smartStats, setSmartStats] = useState(null);
  const [mangoAStats, setMangoAStats] = useState(null);
  const [mangoBStats, setMangoBStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // SmartProxy stats
        const smartRes = await API.get("/smartproxy/subscriptions");
        if (smartRes.data) {
          setSmartStats(smartRes.data[0]);
        }

        // MangoProxy A stats
        const mangoRes = await API.get("/mangoproxy/traffic");
        if (mangoRes.data) {
          setMangoAStats({
            total: (mangoRes.data.totalMB || 0) / 1024,
            available: (mangoRes.data.availableMB || 0) / 1024,
          });
        }

        // ✅ MangoProxy B stats
        const mangoBRes = await API.get("/mangoproxyb/traffic");
        if (mangoBRes.data) {
          setMangoBStats({
            total: (mangoBRes.data.totalMB || 0) / 1024,
            available: (mangoBRes.data.availableMB || 0) / 1024,
          });
        }
      } catch (err) {
        console.error("Proxy API error:", err);
      }
    };

    fetchStats();
  }, []);

  const proxies = [
    {
      platform: "SmartProxy",
      totalUsage: smartStats?.traffic || 0,
      trafficLimit: smartStats?.traffic_limit || 0,
      color: "#4a6cf7",
      route: "/admin/dashboard/proxy/smart",
      proxyURL: "",
      image:
        "https://img.freepik.com/free-vector/wireframe-chain-with-digital-code-lock-blockchain-cyber-security-safe-privacy-concept_127544-953.jpg",
      proxyavataermsla:
        "https://s3-eu-west-1.amazonaws.com/tpd/logos/5d89308558ce38000114f334/0x0.png",
    },
    {
      platform: "MangoProxy A",
      totalUsage: mangoAStats?.total?.toFixed(2) || 0,
      trafficLimit: mangoAStats?.available?.toFixed(2) || 0,
      color: "#facc15",
      route: "/admin/dashboard/proxy/mango",
      proxyURL: "",
      image:
        "https://img.freepik.com/free-vector/wireframe-chain-with-digital-code-lock-blockchain-cyber-security-safe-privacy-concept_127544-953.jpg",
      proxyavataermsla:
        "https://s3-eu-west-1.amazonaws.com/tpd/logos/643b8f60746aa1e4120197d4/0x0.png",
    },

    {
      platform: "MangoProxy B",
      totalUsage: mangoBStats?.total?.toFixed(2) || 0,
      trafficLimit: mangoBStats?.available?.toFixed(2) || 0,
      color: "#facc15",
      route: "/admin/dashboard/proxy/mangob",
      proxyURL: "",
      image:
        "https://img.freepik.com/free-vector/wireframe-chain-with-digital-code-lock-blockchain-cyber-security-safe-privacy-concept_127544-953.jpg",
      proxyavataermsla:
        "https://s3-eu-west-1.amazonaws.com/tpd/logos/643b8f60746aa1e4120197d4/0x0.png",
    },

    {
      platform: "Infatica",
      totalUsage: mangoBStats?.total?.toFixed(2) || 0,
      trafficLimit: mangoBStats?.available?.toFixed(2) || 0,
      color: "#facc15",
      route: "/admin/dashboard/infaticaldashobard",
      proxyURL: "",
      image:
        "https://img.freepik.com/free-vector/wireframe-chain-with-digital-code-lock-blockchain-cyber-security-safe-privacy-concept_127544-953.jpg",
      proxyavataermsla:
        "https://scontent.flhe3-1.fna.fbcdn.net/v/t39.30808-1/299680699_490686989728619_2940728633824879805_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=2d3e12&_nc_eui2=AeGeJgXDlhUFJaTVKAbfQxZHCfxzGTwa_BUJ_HMZPBr8FSQ-qufCLZnZOJGs495I265nk7nGBnlX8BlPoX2rw1LK&_nc_ohc=pNlbxbUS4u4Q7kNvwE-bF5H&_nc_oc=Adlm7jwtoSEHGmJ2VQ09qmtn1H-s0Gn2CxwnczCmpIYpywhRZE0oPfFgfoSszybQcV8&_nc_zt=24&_nc_ht=scontent.flhe3-1.fna&_nc_gid=kNfvlviAXtgX6xZ0HEYyBw&oh=00_AfLqwOjYBsQPdr7-7uZ8maoccsNm8wIoW_MlulYKjBUf0Q&oe=6831141D",
    },
    // {
    //   platform: "Geonode",
    //   totalUsage: 42,
    //   color: "#a855f7",
    //   route: "/admin/dashboard/proxy/geo",
    //   proxyURL: "",
    //   image:
    //     "https://img.freepik.com/free-vector/wireframe-chain-with-digital-code-lock-blockchain-cyber-security-safe-privacy-concept_127544-953.jpg",
    //   proxyavataermsla:
    //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRco0Wy93F0phwqJqWh3-a3Ld0ZZ95TG3mEug&s",
    // },
  ];

  return (
    <div className="proxy-dashboard-container">
      <div className="CRM-leaderboard-wrapper">
        <div className="CRM-leaderboard-ribbon">
          <div className="CRM-ribbon-left"></div>
          <div className="CRM-ribbon-center">Proxy Usage</div>
          <div className="CRM-ribbon-right"></div>
        </div>
      </div>
      <br />
      <Row gutter={[24, 24]}>
        {proxies.map((proxy, idx) => (
          <Col xs={24} sm={12} md={8} lg={6} key={idx}>
            <Card className="CRM-overview-card" hoverable>
              {/* Cover Image */}
              <div className="proxy-card-cover">
                <img
                  src={proxy.image}
                  alt={`${proxy.platform} Cover`}
                  className="proxy-cover-img"
                />
              </div>

              {/* Card Content */}
              <div className="proxy-card-content">
                <div className="proxy-card-text">
                  <p className="proxy-card-title">{proxy.platform}</p>
                  <h2 className="proxy-card-value">
                    Remaining Data:{" "}
                    <span style={{ fontSize: 13, color: "#888" }}>
                      {proxy.trafficLimit} GB
                    </span>
                  </h2>
                </div>

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
