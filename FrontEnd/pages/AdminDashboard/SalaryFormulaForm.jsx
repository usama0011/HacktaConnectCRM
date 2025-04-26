import React from "react";
import { Card, Col, Row, Button } from "antd";
import { Link } from "react-router-dom";
import "../../styles/SalaryFormulaForm.css";
import ComputerIcon from "../../src/assets/computer.png";
import HomeIcon from "../../src/assets/home.png";
const salaryFormulas = [
  {
    title: "Office Agents Salary Formula",
    description: "Manage salary structure for in-office agents.",
    link: "/admin/dashboard/officeagentsalaryformula",
    icon: <img src={ComputerIcon} alt="icon" className="formula-icon" />,
  },
  {
    title: "WFH Agents Salary Formula",
    description: "Setup formula for remote/work-from-home agents.",
    link: "/admin/dashboard/wfhsalaryformula",
    icon: <img src={HomeIcon} alt="icon" className="formula-icon" />,
  },
  {
    title: "Salary Calculator",
    description: "Setup formula for remote/work-from-home agents.",
    link: "/admin/dashboard/generalsalarycalculator",
    icon: <img src={HomeIcon} alt="icon" className="formula-icon" />,
  },
];

const SalaryFormulaForm = () => {
  return (
    <div className="formula-container">
      <h1 className="formula-title">Salary Formula Options</h1>
      <Row gutter={[24, 24]}>
        {salaryFormulas.map((item, index) => (
          <Col key={index} xs={24} sm={12}>
            <Card className="formula-card" hoverable>
              <div className="formula-icon-wrapper">{item.icon}</div>
              <h3 className="formula-card-title">{item.title}</h3>
              <p className="formula-card-description">{item.description}</p>
              <Link to={item.link}>
                <Button className="agentslaafurbuttons" type="primary">
                  Open Formula
                </Button>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SalaryFormulaForm;
