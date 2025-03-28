import React from "react";
import { Card, Input, Collapse, Typography } from "antd";
import { SearchOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import "../../styles/HelpCenter.css";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const HelpCenter = () => {
  return (
    <div className="helpcenter-container">
      <Title level={2} className="helpcenter-title">
        Help Center
      </Title>
      <Text className="helpcenter-subtext">
        Find answers to common questions and get the support you need.
      </Text>

      {/* Search Bar */}
      <div className="helpcenter-search">
        <Input
          placeholder="Search for help topics..."
          prefix={<SearchOutlined />}
          className="helpcenter-search-input"
        />
      </div>

      {/* FAQ Section */}
      <Card className="helpcenter-card">
        <Title level={4} className="helpcenter-faq-title">
          Frequently Asked Questions
        </Title>
        <Collapse accordion>
          <Panel header="How do I reset my password?" key="1">
            <Text>
              To reset your password, go to the login page and click on "Forgot
              password?" Follow the instructions sent to your email.
            </Text>
          </Panel>
          <Panel header="How can I contact support?" key="2">
            <Text>
              You can contact support via email at{" "}
              <strong>support@hacktacrm.com</strong> or through our live chat.
            </Text>
          </Panel>
          <Panel header="Where can I find my account settings?" key="3">
            <Text>
              Your account settings can be accessed from the top right corner of
              the dashboard. Click on your profile picture and select
              "Settings."
            </Text>
          </Panel>
          <Panel header="How do I add a new user?" key="4">
            <Text>
              Navigate to the "Manage Users" section in the Admin Panel, click
              on "Add User," and fill in the required details.
            </Text>
          </Panel>
        </Collapse>
      </Card>

      {/* Contact Support */}
      <Card className="helpcenter-contact-card">
        <QuestionCircleOutlined className="helpcenter-icon" />
        <Title level={4} style={{ color: "white" }}>
          Need More Help?
        </Title>
        <Text style={{ color: "white" }}>
          Our support team is available 24/7. Reach out to us for assistance.
        </Text>
        <a
          href="mailto:support@hacktacrm.com"
          className="helpcenter-contact-link"
        >
          Contact Support
        </a>
      </Card>
    </div>
  );
};

export default HelpCenter;
