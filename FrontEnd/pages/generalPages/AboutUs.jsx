import React from "react";
import '../../styles/AboutUs.css'

const AboutUs = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">Our Offices</h1>
      <div className="about-grid">
        {/* Head Office */}
        <div className="about-card">
          <h2 className="about-heading">HEAD OFFICE</h2>
          <p>Munir plaza, Lower Ground of Silk Bank</p>
          <p>Next to D-Watson Chandni Chowk, Rawalpindi.</p>
          <iframe
            title="Head Office Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3325.164772442772!2d73.12532159999999!3d33.54909500000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfed521ea5dac9%3A0x9b0f210dda3e5058!2sHackta%20Connect!5e0!3m2!1sen!2s!4v1747722552234!5m2!1sen!2s"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="about-map"
          ></iframe>
        </div>

        {/* Branch Office */}
        <div className="about-card">
          <h2 className="about-heading">BRANCH OFFICE</h2>
          <p>Ground Floor Building No. 146, Block C,</p>
          <p>Main Civic Center, Phase-4, Bahria Town, Rawalpindi.</p>
          <iframe
            title="Branch Office Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3325.164772442772!2d73.12532159999999!3d33.54909500000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfed521ea5dac9%3A0x9b0f210dda3e5058!2sHackta%20Connect!5e0!3m2!1sen!2s!4v1747722552234!5m2!1sen!2s"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="about-map"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
