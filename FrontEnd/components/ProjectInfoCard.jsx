import React from "react";
import "../styles/ProjectInfoCard.css";
import warehouseImage from "../src/assets/intro.png";

const ProjectInfoCard = ({ titleproject, projectdes }) => {
  return (
    <div className="project-info-card">
      <div className="project-content">
        <div className="project-text">
          <h2>{titleproject}</h2>
          <p>{projectdes}</p>
        </div>
        <div className="project-image">
          <img src={warehouseImage} alt="Project Illustration" />
        </div>
      </div>

      {/* Wave directly under card, not in project-content */}
      <svg
        className="wave-svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#ff6c47"
          fillOpacity="0.9"
          d="M0,256L60,250.7C120,245,240,235,360,213.3C480,192,600,160,720,133.3C840,107,960,85,1080,96C1200,107,1320,149,1380,170.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        />
        <path
          fill="#079539"
          fillOpacity="0.7"
          d="M0,288L80,261.3C160,235,320,181,480,149.3C640,117,800,107,960,128C1120,149,1280,203,1360,229.3L1440,256L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        />
      </svg>
    </div>
  );
};

export default ProjectInfoCard;
