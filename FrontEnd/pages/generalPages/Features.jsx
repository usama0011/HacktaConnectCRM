import React from "react";
import "../../styles/Features.css";
import ComputerIcon from "../../src/assets/computer.png";

const Features = () => {
  return (
    <div className="crm-features-wrapper">
      {/* HERO SECTION */}
      <section className="crm-features-hero">
        <div className="hero-content">
          <h5>NEW EXPERIENCE</h5>
          <h1>With Landing Page</h1>
          <p>
            There are many variations of passages of you are going to use a
            passage of Lorem Ipsum, you need to be sure.
          </p>
          <div className="hero-buttons">
            <button className="hero-btn primary">More Details</button>
            <button className="hero-btn secondary">Watch Our Video</button>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://img.freepik.com/free-vector/flat-content-management-system_23-2148807862.jpg?ga=GA1.1.1696791716.1743911361&semt=ais_hybrid&w=740"
            alt="Hero Phone"
          />
        </div>
      </section>

      {/* FEATURES OVERVIEW */}
      <section className="crm-features-overview">
        <div className="feature-box">
          <img src={ComputerIcon} alt="Icon" />
          <h3>Easy To Use</h3>
          <p>Lorem ipsum, you need to be sure passage of Lorem Ipsum.</p>
          <span>READ MORE</span>
        </div>
        <div className="feature-box">
          <img src={ComputerIcon} alt="Icon" />
          <h3>Awesome design</h3>
          <p>Lorem ipsum, you need to be sure passage of Lorem Ipsum.</p>
          <span>READ MORE</span>
        </div>
        <div className="feature-box">
          <img src={ComputerIcon} alt="Icon" />
          <h3>Easy to customize</h3>
          <p>Lorem ipsum, you need to be sure passage of Lorem Ipsum.</p>
          <span>READ MORE</span>
        </div>
        <div className="feature-box">
          <img src={ComputerIcon} alt="Icon" />
          <h3>Any time support</h3>
          <p>Lorem ipsum, you need to be sure passage of Lorem Ipsum.</p>
          <span>READ MORE</span>
        </div>
      </section>

      {/* FEATURE DETAILS */}
      <section className="crm-app-details">
        <h2>App Design Features</h2>
        <p>
          At vero eos et accusamus et iusto odio dignissimos ducimus blanditiis
          praesentium voluptatum deleniti
        </p>
        <div className="app-details-wrapper">
          <ul className="feature-list">
            <li>
              <img src={ComputerIcon} alt="Icon" />
              Responsive Web design
            </li>
            <li>
              <img src={ComputerIcon} alt="Icon" />
              Loaded With Features
            </li>
            <li>
              <img src={ComputerIcon} alt="Icon" />
              Friendly Online Support
            </li>
            <li>
              <img src={ComputerIcon} alt="Icon" />
              Responsive Web design
            </li>
          </ul>

          <div className="app-image">
            <img
              src="https://img.freepik.com/free-vector/flat-content-management-system_23-2148807862.jpg?ga=GA1.1.1696791716.1743911361&semt=ais_hybrid&w=740"
              alt="App Design Phone"
            />
          </div>

          <ul className="feature-list">
            <li>
              <img src={ComputerIcon} alt="Icon" />
              Free Updates Forever
            </li>
            <li>
              <img src={ComputerIcon} alt="Icon" />
              Infinite Color
            </li>
            <li>
              <img src={ComputerIcon} alt="Icon" />
              Online Support
            </li>
            <li>
              <img src={ComputerIcon} alt="Icon" />
              Responsive Web design
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Features;
