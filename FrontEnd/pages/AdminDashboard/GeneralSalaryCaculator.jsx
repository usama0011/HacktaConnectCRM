import React, { useState } from "react";
import { Select, InputNumber, Row, Col, Card, Button, message } from "antd";
import "../../styles/GeneralSalaryCalculator.css";
import axios from "axios"; // ✅ Import axios to call your backend
import API from "../../utils/BaseURL";

const { Option } = Select;

const GeneralSalaryCalculator = () => {
  const [agentType, setAgentType] = useState("");
  const [clicks, setClicks] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [result, setResult] = useState(0);
  const [sessionCost, setSessionCost] = useState(0);
  const [clickCost, setClickCost] = useState(0);

  const calculateSalary = async () => {
    try {
      if (!agentType) {
        message.warning("Please select an agent type");
        return;
      }

      const res = await API.post("/salarycalculator", {
        agentType,
        clicks,
        sessions,
      });

      setResult(res.data.salary);
      setSessionCost(res.data.sessionCost);
      setClickCost(res.data.clickCost);
    } catch (error) {
      console.error("Salary calculation failed:", error);
      message.error("Failed to calculate salary. Please try again!");
    }
  };

  return (
    <div className="calculatorPage-wrapper">
      <Row gutter={24}>
        {/* Left Side: Filters */}
        <Col xs={24} md={12}>
          <Card className="calculatorPage-filterCard">
            <h2 className="calculatorPage-heading">Salary Calculator</h2>

            <label>Agent Type</label>
            <Select
              value={agentType}
              onChange={(value) => setAgentType(value)}
              placeholder="Select agent type"
              className="calculatorPage-select"
            >
              <Option value="Office Agent">Office Agent</Option>
              <Option value="WFH Agent">WFH Agent</Option>
            </Select>

            <label style={{ marginTop: "20px" }}>Your Clicks</label>
            <InputNumber
              min={0}
              value={clicks}
              onChange={(value) => setClicks(value)}
              className="calculatorPage-input"
            />

            <label style={{ marginTop: "20px" }}>Your Sessions</label>
            <InputNumber
              min={0}
              value={sessions}
              onChange={(value) => setSessions(value)}
              className="calculatorPage-input"
            />

            <Button
              onClick={calculateSalary}
              className="calculatorPage-calcBtn"
              type="primary"
            >
              Calculate
            </Button>
          </Card>
        </Col>

        {/* Right Side: Result Display */}
        <Col xs={24} md={12}>
          <Card className="calculatorPage-resultCard">
            <div className="calculatorPage-resultTop">
              <p className="calculatorPage-smallText">Your Estimated Salary:</p>
              <h1 className="calculatorPage-bigResult">Rs {result || 0}</h1>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GeneralSalaryCalculator;
