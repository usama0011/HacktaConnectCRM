import React from "react";
import { Card, Col, Row, Button } from "antd";
import {
  DollarCircleOutlined,
  SettingOutlined,
  CalculatorOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../../styles/SalaryManagement.css";

const salaryCards = [
  {
    title: "Salary Sheet",
    subtitle: "Track and manage all salary reports",
    icon: "",
    iconComponent: <DollarCircleOutlined />,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cmVwb3J0fGVufDB8fDB8fHww",
    link: "/admin/dashboard/downloadsalaryworker",
    buttonText: "View",
  },
  {
    title: "View Agents Salary Record",
    subtitle: "Manage salary structures and payment plans",
    icon: "",
    iconComponent: <SettingOutlined />,
    image:
      "https://images.unsplash.com/photo-1575016244395-9270b671d66c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzh8fHNhbGFyeSUyMHJlY29yZHxlbnwwfHwwfHx8MA%3D%3D",
    link: "/admin/dashboard/restemploysalary",
    buttonText: "Manage Salaries",
  },
  {
    title: "Agents Salary Calculator",
    subtitle: "Setup and edit salary formulas",
    icon: "",
    iconComponent: <CalculatorOutlined />,
    image:
      "https://img.freepik.com/free-photo/cropped-view-professional-serious-finance-manager-holding-calculator-hands-checking-company-month-s-profits_176420-7931.jpg?ga=GA1.1.1696791716.1743911361&semt=ais_country_boost&w=740",
    link: "/admin/dashboard/salaryformula",
    buttonText: "Manage Calculator",
  },
  {
    title: "Upload Salary Record",
    subtitle: "Add or upload new salary data",
    icon: "",
    iconComponent: <UploadOutlined />,
    image:
      "https://images.pexels.com/photos/8353796/pexels-photo-8353796.jpeg?auto=compress&cs=tinysrgb&w=600",
    link: "/admin/dashboard/uploadSalaryRecord",
    buttonText: "Upload",
  },
];

const SalaryManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="salary-management-container">
      <br />
      <h1 className="salary-management-title">Salary Management Dashboard</h1>
      <Row gutter={[16, 16]}>
        {salaryCards.map((card, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <Card className="salary-card" hoverable>
              <img
                src={card.image}
                alt="Preview"
                className="salary-card-image"
              />
              <div className="salary-card-content">
                <div className="salary-card-icon">{card.iconComponent}</div>
                <h3 className="salary-card-title">{card.title}</h3>
                <p className="salary-card-subtitle">{card.subtitle}</p>
                <Button
                  className="mainslaryamanbutton"
                  onClick={() => navigate(card.link)}
                  type="primary"
                >
                  {card.buttonText}
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SalaryManagement;
