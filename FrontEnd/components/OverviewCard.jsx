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
      <div className="CRM-leaderboard-wrapper">
        <div className="CRM-leaderboard-ribbon">
          <div className="CRM-ribbon-left"></div>
          <div className="CRM-ribbon-center">LEADERBOARD</div>
          <div className="CRM-ribbon-right"></div>
        </div>
      </div>

      <br />

      <div className="CRM-overview-container">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card style={{padding:"20px"}} className="CRM-overview-carddd" key={index}>
                <Skeleton style={{padding:'20px'}} active avatar paragraph={{ rows: 3 }} />
              </Card>
            ))
          : cardData.map((card, index) => (
              <Card className="CRM-overview-carddd" key={index}>
                <div className="CRM-card-wave-header" />

                <div className="CRM-card-content">
                  <div className="CRM-card-text">
                    <p className="CRM-card-title">{card.rank}</p>
                    <h2 className="CRM-card-value">
                      {card.totalPoints} Points
                    </h2>

                    <p
                      className={`CRM-card-change ${
                        card.changeType === "up"
                          ? "CRM-positive"
                          : "CRM-negative"
                      }`}
                    >
                      {card.changeType === "up" ? (
                        <RiseOutlined
                          style={{ color: "green", marginRight: 4 }}
                        />
                      ) : (
                        <FallOutlined
                          style={{ color: "red", marginRight: 4 }}
                        />
                      )}
                      {card.lastMonthPoints === 0
                        ? "0 vs last month"
                        : `${card.change}% vs last month`}
                    </p>
                    <br />

                    <div className="CRM-extra-info">
                      <p className="CRM-shift">
                        Shift: <strong style={{textTransform:"capitalize"}}>{card.shift}</strong>
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
               
              </Card>
            ))}
      </div>
    </>
  );
};

export default OverviewCard;
