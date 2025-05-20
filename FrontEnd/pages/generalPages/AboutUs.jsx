import React from "react";
import { Button } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import "../../styles/AboutUs.css";

const AboutUs = () => {
  return (
    <div className="aboutus-wrapper">
      <div className="aboutus-left">
        <div className="aboutus-gallery">
          <div className="aboutus-image square">
            <img
              src="https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=600"
              alt="Office 1"
            />
          </div>
          <div className="aboutus-image square">
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600"
              alt="Office 2"
            />
          </div>
          <div className="aboutus-image tall">
            <img
              src="https://images.unsplash.com/photo-1577412647305-991150c7d163"
              alt="Office 3"
            />
          </div>
        </div>
      </div>

      <div className="aboutus-right">
        <p className="aboutus-sub">A BIT</p>
        <h1 className="aboutus-heading">ABOUT US</h1>
        <p className="aboutus-desc">
          From they fine john he give of rich he. They age and draw ms like.
          Improving end distruts may instantly was household applauded
          incommode. Why kept very ever home mrs. Considered sympathize ten
          uncommonly occasional assistance sufficient not.
        </p>
        <div className="aboutus-buttons">
          <Button
            className="aboutus-btn"
            icon={<EnvironmentOutlined />}
            onClick={() =>
              window.open(
                "https://www.google.com/maps/place/Hackta+Connect,+Chandani,+Lower+Ground,+silk+bank.+Next+to+D-Watson+,+Chandani+Chwok,+Chowk,+Rawalpindi,+46000",
                "_blank"
              )
            }
          >
            Head Office
          </Button>
          <Button
            className="aboutus-btn"
            icon={<EnvironmentOutlined />}
            onClick={() =>
              window.open("https://maps.app.goo.gl/B3aN7WxuPbfwhCyC9", "_blank")
            }
          >
            Branch Office
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
