import React, { useState } from "react";
import { Form, InputNumber, Button, Card, Row, Col, Divider } from "antd";
import {
  DollarCircleOutlined,
  ThunderboltOutlined,
  GiftOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import "../../styles/WFHSalaryFormula.css";

const WFHSalaryFormula = () => {
  const [form] = Form.useForm();
  const [formulaDetails, setFormulaDetails] = useState(null);

  const handleFinish = (values) => {
    setFormulaDetails(values);
  };

  return (
    <div className="wfhFormula-container">
      <h1 className="wfhFormula-heading">
        Hackta Connect - WFH Agent Salary Setup
      </h1>

      <Card className="wfhFormula-formCard">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
        >
          <Divider orientation="left" plain className="wfhFormula-sectionTitle">
            Basic Salary Fields
          </Divider>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                label={
                  <span>
                    <DollarCircleOutlined /> Session IP Cost
                  </span>
                }
                name="sessionCost"
                rules={[{ required: true }]}
              >
                <InputNumber className="wfhFormula-input" min={0} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={
                  <span>
                    <ThunderboltOutlined /> Click IP Cost
                  </span>
                }
                name="clickCost"
                rules={[{ required: true }]}
              >
                <InputNumber className="wfhFormula-input" min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left" plain className="wfhFormula-sectionTitle">
            Bonus Fields
          </Divider>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                label={
                  <span>
                    <GiftOutlined /> Bonus
                  </span>
                }
                name="bonus"
                rules={[{ required: true }]}
              >
                <InputNumber className="wfhFormula-input" min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left" plain className="wfhFormula-sectionTitle">
            Duduction
          </Divider>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                label={
                  <span>
                    <FrownOutlined /> Absent Fine
                  </span>
                }
                name="absentFine"
                rules={[{ required: true }]}
              >
                <InputNumber className="wfhFormula-input" min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="wfhFormula-submitBtn"
            >
              Save Formula
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {formulaDetails && (
        <div className="wfhFormula-summary">
          <h2 className="wfhFormula-summaryTitle">
            🖥️ WFH Salary Formula Summary
          </h2>
          <Row gutter={[24, 24]}>
            {Object.entries(formulaDetails).map(([key, value]) => (
              <Col key={key} xs={24} sm={12} md={8} lg={6}>
                <Card className="wfhFormula-summaryCard">
                  <p className="wfhFormula-summaryLabel">
                    {key.replace(/_/g, " ").toUpperCase()}
                  </p>
                  <p className="wfhFormula-summaryValue">Rs {value}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default WFHSalaryFormula;
