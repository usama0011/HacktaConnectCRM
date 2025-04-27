import "../styles/OverviewCard.css";
import { Card } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { RiseOutlined, FallOutlined } from "@ant-design/icons"; // ✅ Import Up/Down icons
import API from "../utils/BaseURL";

const OverviewCard = () => {
  const [cardData, setCardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get("/qcpoints/topagents", {
          params: {
            year: new Date().getFullYear(),
            month: String(new Date().getMonth() + 1).padStart(2, "0"),
          },
        });
        setCardData(res.data);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);
  console.log(cardData);
  return (
    <>
      <div className="CRM-leaderboard-ribbon">
        <div className="CRM-ribbon-left" />
        <div className="CRM-ribbon-center">LEADERBOARD</div>
        <div className="CRM-ribbon-right" />
      </div>
      <br />

      <div className="CRM-overview-container">
        {cardData.map((card, index) => (
          <Card className="CRM-overview-card" key={index}>
            <div className="CRM-card-content">
              <div className="CRM-card-text">
                <p className="CRM-card-title">{card.rank}</p>
                <h2 className="CRM-card-value">{card.totalPoints} Points</h2>

                <p
                  className={`CRM-card-change ${
                    card.changeType === "up" ? "CRM-positive" : "CRM-negative"
                  }`}
                >
                  {card.changeType === "up" ? (
                    <RiseOutlined style={{ color: "green", marginRight: 4 }} />
                  ) : (
                    <FallOutlined style={{ color: "red", marginRight: 4 }} />
                  )}
                  {card.lastMonthPoints === 0
                    ? "0 vs last month"
                    : `${card.change}% vs last month`}
                </p>

                <div className="CRM-extra-info">
                  <p className="CRM-shift">
                    Shift: <strong>{card.shift}</strong>
                  </p>
                  <p className="CRM-totalips">
                    Total IPs: <strong>{card.totalIPs}</strong>
                  </p>
                </div>
              </div>

              <img
                className="CRM-card-icon"
                src={card.avatar || ""}
                alt="icon"
              />
            </div>

            {/* Bottom Banner */}
            <div className="CRM-card-banner">
              <div className="CRM-banner-left">
                <img
                  className="CRM-banner-avatar"
                  src={card.avatar || ""}
                  alt="profile"
                />
                <span className="CRM-banner-name">{card.username}</span>
              </div>
              <div className="CRM-banner-points">
                <span className="CRM-points-icon">🪙</span>
                <span className="CRM-banner-score">{card.totalPoints} pts</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default OverviewCard;
