import React from "react";
import { Button } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import HacktaOne from "../../src/assets/hacktaone.jpg";
import HacktaTwo from "../../src/assets/hacktatwo.jpg";
import HacktaThree from "../../src/assets/hacktathree.jpg";
import HacktaImageFour from "../../src/assets/hacktfour.jpg";
import "../../styles/AboutUs.css";

const AboutUs = () => {
  return (
    <div className="aboutus-wrapper">
      <div className="aboutus-left">
        <div className="aboutus-gallery">
          <div className="aboutus-image portrait">
            <img src={HacktaThree} />
          </div>

          <div className="aboutus-center-column">
            <div className="aboutus-image square">
              <img src={HacktaImageFour} />
            </div>
            <div className="aboutus-image square">
              <img src={HacktaOne} />
            </div>
          </div>

          <div className="aboutus-image portrait">
            <img src={HacktaTwo} />
          </div>
        </div>
      </div>

      <div className="aboutus-right">
        <p className="aboutus-sub">A BIT</p>
        <h1 className="aboutus-heading">ABOUT US</h1>
        <p className="aboutus-desc">
          Hackta Connect is a digital company committed to empowering fresh
          graduates with real opportunities to learn, grow, and thrive. Our
          friendly, pressure-free environment encourages continuous learning and
          professional development. With both in-office and Work From Home
          roles, we offer flexibility and a culture where every day brings
          something new. At Hackta, growth isn’t just possible it’s part of the
          job. Start your journey where learning leads to success.
        </p>
        <div className="aboutus-buttons">
          <Button
            className="aboutus-btn"
            icon={<EnvironmentOutlined />}
            onClick={() =>
              window.open(
                "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.954690380083!2d73.0711438!3d33.6324168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df9329dc74dc29%3A0x4c673150f0360381!2sHackta%20Connect!5e0!3m2!1sen!2s!4v1750946462001!5m2!1sen!2s",
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



