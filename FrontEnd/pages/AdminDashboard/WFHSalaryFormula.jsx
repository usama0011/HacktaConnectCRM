import React, { useState, useEffect } from "react";
import {
  Form,
  InputNumber,
  Button,
  Card,
  Row,
  Col,
  Divider,
  message,
} from "antd";
import {
  DollarCircleOutlined,
  ThunderboltOutlined,
  GiftOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import "../../styles/WFHSalaryFormula.css";
import axios from "axios";

const WFHSalaryFormula = () => {
  const [form] = Form.useForm();
  const [formulaDetails, setFormulaDetails] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  const handleFinish = async (values) => {
    try {
      if (isUpdate) {
        // If formula exists, PUT to update
        await axios.put("http://localhost:5000/api/wfhformula", values);
        message.success("WFH Formula Updated Successfully!");
      } else {
        // Else POST to create
        await axios.post("http://localhost:5000/api/wfhformula", values);
        message.success("WFH Formula Saved Successfully!");
      }
      setFormulaDetails(values);
      setIsUpdate(true);
    } catch (error) {
      message.error("Failed to save WFH Salary Formula");
    }
  };

  const fetchExistingFormula = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/wfhformula");
      if (res.data.success && res.data.formula) {
        form.setFieldsValue(res.data.formula);
        setFormulaDetails(res.data.formula);
        setIsUpdate(true);
      }
    } catch (error) {
      console.log("No existing WFH formula found");
    }
  };

  useEffect(() => {
    fetchExistingFormula();
  }, []);

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
            Deduction
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
              {isUpdate ? "Update Formula" : "Save Formula"}
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
