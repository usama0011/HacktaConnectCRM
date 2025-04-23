import "../styles/OverviewCard.css";
import { Card } from "antd";

const cardData = [
  {
    title: "#01 Rank",
    value: "857 Points",
    change: "-10% vs past month",
    changeType: "down",
    iconURL:
      "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg",
    shift: "Morning",
    totalIPs: 120,
  },
  {
    title: "#02 Rank",
    value: "158 Points",
    change: "+20% vs past month",
    changeType: "up",
    iconURL:
      "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg",
    shift: "Evening",
    totalIPs: 95,
  },
  {
    title: "#03 Rank",
    value: "1.5k Points",
    change: "+5% vs past month",
    changeType: "up",
    iconURL:
      "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg",
    shift: "Night",
    totalIPs: 110,
  },
];

const OverviewCard = () => {
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
                <p className="CRM-card-title">{card.title}</p>
                <h2 className="CRM-card-value">{card.value}</h2>
                <p
                  className={`CRM-card-change ${
                    card.changeType === "up" ? "CRM-positive" : "CRM-negative"
                  }`}
                >
                  {card.change}
                </p>

                {/* 👇 New */}
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
                src={card.iconURL || ""}
                alt="icon"
              />
            </div>

            {/* Bottom Banner */}
            <div className="CRM-card-banner">
              <div className="CRM-banner-left">
                <img
                  className="CRM-banner-avatar"
                  src={card.iconURL || ""}
                  alt="profile"
                />
                <span className="CRM-banner-name">USERNAME01</span>
              </div>
              <div className="CRM-banner-points">
                <span className="CRM-points-icon">🪙</span>
                <span className="CRM-banner-score">{card.value}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default OverviewCard;
