import React from "react";
import { Collapse, Card, Typography } from "antd";
import "../../styles/Faqs.css";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const Faqs = () => {
  const faqData = [
    {
      question: "What is Hackta Connect CRM?",
      answer:
        "Hackta Connect CRM is a customer relationship management system designed for businesses to manage their clients, reports, and analytics efficiently.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "You can reset your password by clicking on the 'Forgot Password' link on the login page and following the instructions.",
    },
    {
      question: "Can I use Hackta Connect CRM on mobile?",
      answer:
        "Yes, our platform is fully responsive and can be accessed on mobile and tablet devices.",
    },
    {
      question: "Is my data secure in Hackta Connect CRM?",
      answer:
        "Yes, we use high-level encryption and secure servers to protect your data.",
    },
    {
      question: "How can I contact support?",
      answer:
        "You can reach out to our support team via email at support@hacktaconnect.com or use the live chat feature.",
    },
    {
      question: "Can I integrate third-party tools with Hackta Connect CRM?",
      answer:
        "Yes, we support integrations with popular tools like Slack, Google Calendar, and Zapier.",
    },
    {
      question: "What are the pricing plans for Hackta Connect CRM?",
      answer:
        "We offer multiple pricing plans, including Free, Standard, and Enterprise. Visit our pricing page for details.",
    },
    {
      question: "How do I add a new user to my team?",
      answer:
        "Go to the Admin Dashboard > Manage Users > Add New User and enter the required details.",
    },
    {
      question: "Can I customize my dashboard?",
      answer:
        "Yes, the dashboard is fully customizable. You can add, remove, and rearrange widgets as per your needs.",
    },
    {
      question: "Does Hackta Connect CRM provide analytics?",
      answer:
        "Yes, we provide detailed analytics and reports to track your business performance.",
    },
    {
      question: "What browsers are supported?",
      answer:
        "Our platform supports Chrome, Firefox, Edge, and Safari for the best experience.",
    },
    {
      question: "Can I export my data?",
      answer:
        "Yes, you can export reports and user data in CSV and PDF formats.",
    },
    {
      question: "How do I delete my account?",
      answer:
        "You can request account deletion by contacting support. Note that this action is irreversible.",
    },
    {
      question: "What happens if I exceed my plan limits?",
      answer:
        "You will be notified, and you can upgrade your plan to continue using all features.",
    },
    {
      question: "Can I set user permissions?",
      answer:
        "Yes, admins can set different permission levels for users in the settings panel.",
    },
    {
      question: "Is there an API available?",
      answer:
        "Yes, Hackta Connect CRM provides an API for developers to integrate their own applications.",
    },
    {
      question: "Do you offer training for new users?",
      answer:
        "Yes, we have tutorial videos, documentation, and webinars available for new users.",
    },
    {
      question: "Can I schedule reports automatically?",
      answer:
        "Yes, you can set up automated reports to be emailed at specific intervals.",
    },
    {
      question: "How often is the system updated?",
      answer:
        "We release updates regularly to improve performance and add new features.",
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept Visa, MasterCard, PayPal, and bank transfers.",
    },
  ];

  return (
    <div className="faqs-container">
      <Title level={2} className="faqs-title">
        Frequently Asked Questions (FAQs)
      </Title>
      <Text className="faqs-subtext">
        Find answers to commonly asked questions about Hackta Connect CRM.
      </Text>

      <Card className="faqs-card">
        <Collapse accordion>
          {faqData.map((faq, index) => (
            <Panel header={faq.question} key={index} className="faq-panel">
              <Text>{faq.answer}</Text>
            </Panel>
          ))}
        </Collapse>
      </Card>
    </div>
  );
};

export default Faqs;
