import React from "react";
import "./App.css";
import RevenueImage from "../src/assets/revenue.png";
import Peoples from "../src/assets/peoples.png";
import Image1 from "../src/assets/facebook.png";
import Image2 from "../src/assets/google.png";
import Image3 from "../src/assets/mailchimp.png";
import Image4 from "../src/assets/teammanage.png";
import Image5 from "../src/assets/slack.png";
import Image6 from "../src/assets/amazon.png";
import AdminLogo from "../src/assets/mainlogo.png";
import NetworkLogo from "../src/assets/network.png";
import { UserOutlined, IdcardOutlined } from "@ant-design/icons";
import TeamCollobration from "../src/assets/Collaburatoin.jpg";
import { Link, useNavigate } from "react-router-dom";

import Team from "../src/assets/team.png";
import TeamHandShake from "../src/assets/handshake.png";
import TeamComputer from "../src/assets/computer.png";
import Image7 from "../src/assets/cloud.png";
import Image8 from "../src/assets/Insights.png";
import Image9 from "../src/assets/marketing.png";
import Image10 from "../src/assets/automation.png";
import TickImage from "../src/assets/tick.png";
import Support from "../src/assets/support.png";
import Setup from "../src/assets/setup.png";
import BlockQuote from "../src/assets/quote.png";
const App = () => {
  const navigate = useNavigate();
  return (
    <div className="crm-wrapper">
      {/* ================= TOP BANNER ================ */}
      <div className="crm-announcement">
        Hackta-Connect the digital world of tech.
      </div>

      {/* ================= NAVBAR ================= */}
      <nav className="crm-navbar">
        <div className="crm-logo">{/* Logo image here */}</div>
        <ul className="crm-menu">
          <li>About</li>
          
          <li>Policies</li>
          <li>
            <Link to="company">Company</Link>{" "}
          </li>
        </ul>
        <div className="crm-auth-buttons">
          <button className="login-btn" onClick={() => navigate("/login")}>
            Log In
          </button>
        </div>
      </nav>

      {/* =============== HERO SECTION ================ */}
      <section className="crm-hero">
        <div className="crm-hero-left">
          <button className="crm-tag">Seamless Integration</button>
          <h1>
            Boost Efficiency, <br /> Automate Workflows, <br /> and Drive Growth
          </h1>
          <p>
            Hackta Connect CRM empowers businesses with cutting-edge technology
            to streamline operations, enhance customer relationships, and
            maximize revenue.
          </p>
          <div className="crm-hero-buttons">
            <button className="get-started">Get Started</button>
            <button className="learn-more">Learn More</button>
          </div>
          <div className="crm-rating">
            <span className="stars">⭐⭐⭐⭐⭐</span>
            <span>4.8</span>
            <div className="avatars">{/* Add avatar images */}</div>
            <span>From 500+</span>
          </div>
        </div>
        <div className="crm-hero-right">
          <div className="crm-hero-image">
            <img
              src="https://img.freepik.com/free-photo/3d-rendering-business-meeting-working-room-office-building_105762-1992.jpg?t=st=1745039008~exp=1745042608~hmac=f55b5be221f7a4e9f0324279e2e09821638dbc26bc2ef0bc55b3b8d471983545&w=996"
              alt=""
            />
          </div>
          <div className="crm-widget revenue">
            <img style={{ objectFit: "contain" }} src={RevenueImage} alt="" />
            Total Revenue
          </div>
          <div className="crm-widget customers">
            <img style={{ objectFit: "contain" }} src={Peoples} alt="" />
            Total Customers
          </div>
        </div>
      </section>

      {/* ============ PARTNER SECTION ============ */}
      <section className="crm-partners">
        <span>Our Supported Partner</span>
        <div className="crm-partner-logos">
          {/* Add logos: Amazon, Slack, Dropbox, Shopify */}
          <img src={Image1} alt="" />
          <img src={Image2} alt="" />
          <img src={Image3} alt="" />
          <img src={Image4} alt="" />
          <img src={Image5} alt="" />
          <img src={Image6} alt="" />
        </div>
      </section>
<br />
<br />
      {/* ============ FEATURE CARDS ============ */}
      <section className="crm-feature-section">
        <h2>Smart Automation, Limitless Possibilities</h2>
        <p className="crm-featuersectiontext">
          WithHackta Connect, you get a powerful automation platform designed to
          optimize your workflow and scale your business effortlessly.
        </p>
        <div className="crm-feature-cards">
          <div className="card">
            <img src={Image7} alt="" />
            <h3>AI-Powered Insights</h3>
            <p>Make data-driven decisions with real-time analytics.</p>
          </div>
          <div className="card">
            <img src={Image8} alt="" />
            <h3>Workflow Automation</h3>
            <p>Streamline repetitive tasks and boost efficiency.</p>
          </div>
          <div className="card">
            <img src={Image9} alt="" />
            <h3>Omni-Channel Marketing</h3>
            <p>Engage your audience across multiple platforms seamlessly.</p>
          </div>
          <div className="card">
            <img src={Image10} alt="" />
            <h3>Secure Cloud Integration</h3>
            <p>Sync and access your data anytime, anywhere.</p>
          </div>
        </div>
      </section>

      {/* ============ PERFORMANCE SPLIT ============ */}
      <section className="crm-performance-section">
        <div className="crm-performance-image">
          <img
            src="https://img.freepik.com/free-photo/elegant-cozy-office-space_23-2149548666.jpg?t=st=1745041406~exp=1745045006~hmac=d6b2df4baf46f5101c4d0acf07997919d265ff79f0da39e41636e693c5430338&w=900"
            alt=""
          />
        </div>
        <div className="crm-performance-text">
          <h2>Customer-Driven Solutions withHackta Connect</h2>
          <p>
            AtHackta Connect, we focus on delivering tailored solutions that
            meet your customers’ needs.
          </p>
          <ul>
            <li>
              {" "}
              <img className="tickinocns" src={TickImage} alt="" />
              Personalized Engagement
            </li>
            <li>
              {" "}
              <img className="tickinocns" src={TickImage} alt="" />
              Smart Data Analytics
            </li>
            <li>
              {" "}
              <img className="tickinocns" src={TickImage} alt="" />
              Seamless Integration
            </li>
            <li>
              <img className="tickinocns" src={TickImage} alt="" />
              24/7 Customer Support
            </li>
          </ul>
          <div className="crm-stats">
            <div>
              <strong>200+</strong> <br /> Business Partners
            </div>
            <div>
              <strong>30K+</strong> <br /> Satisfied Customers
            </div>
            <div>
              <strong>10+</strong> <br /> Years of Excellence
            </div>
          </div>
        </div>
      </section>

      {/* ============ TOOLS SECTION ============ */}
      <section className="crm-tools">
        <h2>Seamless Integrations with Your Favorite Tools</h2>
        <div className="crm-tool-boxes">
          <div className="tools-supported">
            <img src={Support} alt="" />
            <h2>
              <p>Supported Integrations</p>
            </h2>
            <small>
              Effortlessly connectHackta Connect CRM with the apps and services
              you rely on.
            </small>
          </div>
          <div className="tools-benefits">
            <img src={Setup} alt="" />
            <h2>
              <p>Faster Setup</p>
            </h2>
            <p>Automate Workflows</p>
            <p>Lower Costs</p>
          </div>
        </div>
      </section>

      {/* ============ PRICING SECTION ============ */}
      <section className="crm-decor-image-section">
        <h1>Team Collaboration</h1>
        <div className="crm-decor-image-wrapper">
          <img
            src={TeamCollobration}
            alt="Team Collaboration"
            className="crm-decor-image"
          />

          {/* Floating icons (URLs to be added by you) */}
          <img src={Team} alt="Icon 1" className="crm-decor-icon icon-1" />
          <img
            src={TeamHandShake}
            alt="Icon 2"
            className="crm-decor-icon icon-2"
          />
          <img
            src={TeamComputer}
            alt="Icon 3"
            className="crm-decor-icon icon-3"
          />
        </div>
      </section>

      {/* ============ TESTIMONIAL SECTION ============ */}
      <section className="crm-testimonial">
        <blockquote>
          <img src={BlockQuote} alt="" />
          <p>
            Hackta Connect CRM has completely transformed the way we manage
            leads and customer interactions.
          </p>
          <footer className="crm-testimonial-footer">
            <cite>
              <UserOutlined style={{ marginRight: 6 }} />
              Michael Ricard
            </cite>
            <br />
            <small>
              <IdcardOutlined style={{ marginRight: 6 }} />
              Marketing Director
            </small>
          </footer>
        </blockquote>
        <div className="testimonial-image">
          <img
            src="https://img.freepik.com/free-photo/portrait-handsome-smiling-businessman_1163-5422.jpg?ga=GA1.1.1696791716.1743911361&semt=ais_hybrid&w=740"
            alt=""
          />
        </div>
      </section>

      {/* ============ CTA FOOTER ============ */}
      <section className="crm-cta">
        <div className="crm-cta-left">
          <div className="crm-icon-box">
            <img src={NetworkLogo} alt="" />
          </div>
          <h3>Boost Your Business with Hackta Connect CRM!</h3>
          <p>
            Streamline workflows, automate tasks, and drive growth—all in one
            platform.
          </p>
          <button>Get Started Now</button>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
     

      <div className="crm-copyright">
        © 2024 Hackta Connect All Rights Reserved.
        <span>
          <a href="#">Privacy Policy</a> | <a href="#">Legal</a> |{" "}
          <a href="#">Terms & Conditions</a>
        </span>
      </div>
    </div>
  );
};

export default App;
