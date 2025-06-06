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
import axios from "axios";
import "../../styles/OfficeAgentsSalaryFormula.css";
import {
  DollarCircleOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  GiftOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import API from "../../utils/BaseURL";

const OfficeAgentsSalaryFormula = () => {
  const [form] = Form.useForm();
  const [salaryDetails, setSalaryDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Track if editing existing

  // Fetch the existing formula on load
  const fetchFormula = async () => {
    try {
      const res = await API.get("/salaryformulaofficeagents");
      if (res.data.success) {
        const data = res.data.formula;
        form.setFieldsValue(data);
        setSalaryDetails(data);
        setIsEditing(true); // means formula exists already
      }
    } catch (error) {
      console.log("No existing formula or error fetching:", error.message);
    }
  };

  useEffect(() => {
    fetchFormula();
  }, []);

  const handleFinish = async (values) => {
    try {
      if (isEditing) {
        // Update existing formula
        await API.put("/salaryformulaofficeagents", values);
        message.success("Formula updated successfully!");
      } else {
        // Create new formula
        await API.post("/salaryformulaofficeagents", values);
        message.success("Formula created successfully!");
      }
      setSalaryDetails(values);
      setIsEditing(true);
    } catch (error) {
      console.error(error);
      message.error("Failed to save formula");
    }
  };

  return (
    <div className="salaryFormula-container">
      <h1 className="salaryFormula-heading">
        Office Agent Salary Pattern
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
            <Col xs={24} sm={12} md={8} lg={6}>
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
            <Col xs={24} sm={12} md={8} lg={6}>
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
            Max Salary
          </Divider>
          <Row gutter={24}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                label={
                  <span>
                    <ThunderboltOutlined /> Maximum Salary
                  </span>
                }
                name="maxSalary"
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
            {[
              "qc110_119",
              "qc120_129",
              "qc130_139",
              "qc140_149",
              "qc150_plus",
            ].map((field, idx) => (
              <Col  xs={24} sm={12} md={8} lg={6} key={field}>
                <Form.Item
                  label={
                    <span>
                      <TrophyOutlined />{" "}
                      {field.replace("qc", "").replace("_", " - ")}
                    </span>
                  }
                  name={field}
                  rules={[{ required: true }]}
                >
                  <InputNumber className="salaryFormula-input" />
                </Form.Item>
              </Col>
            ))}
          </Row>

          <Divider
            orientation="left"
            plain
            className="salaryFormula-sectionTitle"
          >
            Bonus Reward
          </Divider>
          <Row gutter={24}>
            <Col xs={24} sm={12} md={8} lg={6}>
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
            <Col xs={24} sm={12} md={8} lg={6}>
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
              {isEditing ? "Update Pattern" : "Save Formula"}
            </Button>
          </Form.Item>
        </Form>
      </Card>

      
    </div>
  );
};

export default OfficeAgentsSalaryFormula;
