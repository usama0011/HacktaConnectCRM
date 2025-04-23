import React from "react";
import { Card, Collapse, Button } from "antd";
import {
  PhoneOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import "../../styles/Company.css";

const { Panel } = Collapse;

const Company = () => {
  return (
    <div className="crm-company-wrapper">
      {/* ========== HERO SECTION ========== */}
      <section className="crm-company-hero">
        <p className="crm-subtitle">Case Studies</p>
        <h1>
          Delivering IT <span className="highlight">Solutions</span> That Enable
          You To Work Smarter
        </h1>
        <p className="crm-desc">
          Aliquam et consectetur urna et, amet vitae nibh. Dui habitasse platea
          dictumst. Quisque vitae erat sed morbi eleifend mauris. Nullam lacus
          libero, bibendum non, bibendum id, ultrices porta velit.
        </p>
      </section>

      {/* ========== CARD SECTION ========== */}
      <section className="crm-company-cards">
        {[...Array(6)].map((_, index) => (
          <Card
            key={index}
            hoverable
            cover={
              <img
                alt="Case Study"
                src="https://img.freepik.com/free-photo/close-up-young-colleagues-having-meeting_23-2149060259.jpg?ga=GA1.1.1696791716.1743911361&semt=ais_hybrid&w=740"
              />
            }
            className="crm-company-card"
          >
            <div className="card-meta">
              <p className="category">Software Development</p>
              <h3 className="title">Sample Title {index + 1}</h3>
              <p className="desc">
                Proin et turpis nec metus bibendum tempus. Proin at fringilla
                odio. Integer accumsan.
              </p>
              <Button type="primary" className="read-btn">
                Read More
              </Button>
            </div>
          </Card>
        ))}
      </section>

      {/* ========== CTA GREEN SECTION ========== */}
      <section className="crm-cta-green">
        <h2>
          From The Cloud To <span className="highlight">Customers</span>, We
          Bring All The Answers
        </h2>
        <p>
          Aliquam et consectetur urna et, amet vitae nibh. Dui habitasse platea
          dictumst. Quisque vitae erat sed morbi eleifend.
        </p>
        <div className="cta-buttons">
          <Button type="primary" className="quote-btn">
            Get A Quote
          </Button>
          <span className="phone">
            <PhoneOutlined /> +111-222-333
          </span>
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section className="crm-faq">
        <div className="faq-left">
          <div className="counter-box">
            <h1>1,274+</h1>
            <p>Client Satisfaction</p>
          </div>
          <img
            src="https://img.freepik.com/free-vector/discussion-concept-illustration_114360-4990.jpg?t=st=1745346904~exp=1745350504~hmac=715e565aa138f46b300d3672b4f70900319d3f830b00ba3557e4ccc477338b2b&w=996"
            alt="Vector Art"
            className="faq-image"
          />
        </div>

        <div className="faq-right">
          <h2>General Question</h2>
          <p>
            Learn more about our CRM services and solutions. Get answers to your
            common queries here.
          </p>
          <Collapse defaultActiveKey={["1"]} accordion>
            <Panel
              header="How To Change My Photo From Admin Dashboard?"
              key="1"
            >
              <p>This is the answer to how to change your photo.</p>
            </Panel>
            <Panel header="How To Change My Password Easily?" key="2">
              <p>This is the answer for password change.</p>
            </Panel>
            <Panel
              header="How To Change My Subscription Plan Using PayPal?"
              key="3"
            >
              <p>This is the PayPal subscription answer.</p>
            </Panel>
          </Collapse>
        </div>
      </section>
    </div>
  );
};

export default Company;
