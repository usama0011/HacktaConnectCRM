import React from "react";
import { Card, Col, Row, Button } from "antd";
import { Link } from "react-router-dom";
import "../../styles/SalaryFormulaForm.css";
import ComputerIcon from "../../src/assets/computer.png";
import HomeIcon from "../../src/assets/home.png";
import Calculator from "../../src/assets/calculator.png";
const salaryFormulas = [
  {
    title: "Office Agents Salary Pattern",
    description: "Setup Pattern for Office  agents.",
    link: "/admin/dashboard/officeagentsalaryformula",
    icon: <img src={ComputerIcon} alt="icon" className="formula-icon" />,
  },
  {
    title: "WFH Agents Salary Pattern",
    description: "Setup Pattern for remote/work-from-home agents.",
    link: "/admin/dashboard/wfhsalaryformula",
    icon: <img src={HomeIcon} alt="icon" className="formula-icon" />,
  },
  {
    title: "Salary Calculator",
    description:
      "View estimated salary projection based on current performance.",
    link: "/admin/dashboard/generalsalarycalculator",
    icon: <img src={Calculator} alt="icon" className="formula-icon" />,
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

              <Button className="agentslaafurbuttons" type="primary">
                <Link
                  to={item.link}
                  style={{ width: "100%" }}
                >
                  {item.title === "Salary Calculator"
                    ? "Open Calculator"
                    : " Open Pattern"}
                </Link>
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SalaryFormulaForm;
