import "../styles/OverviewCard.css";
import { Card, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { RiseOutlined, FallOutlined, HighlightFilled } from "@ant-design/icons"; // ✅ Import Up/Down icons
import API from "../utils/BaseURL";

const OverviewCard = () => {
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await API.get("/qcpoints/topagents", {
          params: {
            year: new Date().getFullYear(),
            month: String(new Date().getMonth() + 1).padStart(2, "0"),
          },
        });
        setCardData(res.data);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <>
      <div className="CRM-leaderboard-ribbon">
        <div className="CRM-ribbon-left" />
        <div className="CRM-ribbon-center">LEADERBOARD</div>
        <div className="CRM-ribbon-right" />
      </div>
      <br />

      <div className="CRM-overview-container">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card className="CRM-overview-carddd" key={index}>
                <Skeleton active avatar paragraph={{ rows: 3 }} />
              </Card>
            ))
          : cardData.map((card, index) => (
              <Card className="CRM-overview-carddd" key={index}>
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
                    <span className="CRM-points-icon"><HighlightFilled/></span>
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
