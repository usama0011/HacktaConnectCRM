import React, { useState } from "react";
import { Form, InputNumber, Button, Card, Row, Col, Divider } from "antd";
import "../../styles/OfficeAgentsSalaryFormula.css";
// Import these at the top
import {
  DollarCircleOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  GiftOutlined,
  FrownOutlined,
} from "@ant-design/icons";

const OfficeAgentsSalaryFormula = () => {
  const [form] = Form.useForm();
  const [salaryDetails, setSalaryDetails] = useState(null);

  const handleFinish = (values) => {
    setSalaryDetails(values);
  };

  return (
    <div className="salaryFormula-container">
      <h1 className="salaryFormula-heading">
        Hackta Connect - Office Agent Salary Setup
      </h1>

      <Card className="salaryFormula-formCard">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
        >
          <Divider
            orientation="left"
            plain
            className="salaryFormula-sectionTitle"
          >
            IP Compensation
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
                <InputNumber className="salaryFormula-input" min={0} />
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
                <InputNumber className="salaryFormula-input" min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Divider
            orientation="left"
            plain
            className="salaryFormula-sectionTitle"
          >
            QC Points Reward
          </Divider>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                label={
                  <span>
                    <TrophyOutlined /> 110 - 119
                  </span>
                }
                name="qc110_119"
                rules={[{ required: true }]}
              >
                <InputNumber className="salaryFormula-input" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={
                  <span>
                    <TrophyOutlined /> 120 - 129
                  </span>
                }
                name="qc120_129"
                rules={[{ required: true }]}
              >
                <InputNumber className="salaryFormula-input" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={
                  <span>
                    <TrophyOutlined /> 130- 139
                  </span>
                }
                name="qc130_139"
                rules={[{ required: true }]}
              >
                <InputNumber className="salaryFormula-input" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={
                  <span>
                    <TrophyOutlined /> 140 - 149
                  </span>
                }
                name="qc140_149"
                rules={[{ required: true }]}
              >
                <InputNumber className="salaryFormula-input" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                label={
                  <span>
                    <TrophyOutlined /> 150+
                  </span>
                }
                name="qc150_plus"
                rules={[{ required: true }]}
              >
                <InputNumber className="salaryFormula-input" />
              </Form.Item>
            </Col>
          </Row>
          <Divider
            orientation="left"
            plain
            className="salaryFormula-sectionTitle"
          >
            Bonus Reward
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
                <InputNumber className="salaryFormula-input" />
              </Form.Item>
            </Col>
          </Row>
          <Divider
            orientation="left"
            plain
            className="salaryFormula-sectionTitle"
          >
            Absent Fine
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
                <InputNumber className="salaryFormula-input" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="salaryFormula-submitBtn"
            >
              Save Formula
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {salaryDetails && (
        <div className="salaryFormula-summary">
          <h2 className="salaryFormula-summaryTitle">
            💼 Salary Formula Summary
          </h2>
          <Row gutter={[24, 24]}>
            {Object.entries(salaryDetails).map(([key, value]) => (
              <Col key={key} xs={24} sm={12} md={8} lg={4}>
                <Card className="salaryFormula-summaryCard">
                  <p className="salaryFormula-summaryLabel">
                    {key.replace(/_/g, " ").toUpperCase()}
                  </p>
                  <p className="salaryFormula-summaryValue">Rs {value}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default OfficeAgentsSalaryFormula;
