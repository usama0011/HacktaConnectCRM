import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  message,
  Row,
  Col,
  Divider,
  DatePicker,
  Upload,
  Checkbox,
  
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  BankOutlined,
  InboxOutlined,
  FileWordOutlined,
  FormOutlined,
} from "@ant-design/icons";
import axios from "axios";

import "../../styles/AddNewUser.css";
import API from "../../utils/BaseURL";
import { useUserContext } from "../../context/UserContext";

const { Option } = Select;
const { Dragger } = Upload;

const AddNewUser = () => {
  const { user } = useUserContext();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [superAdminExists, setSuperAdminExists] = useState(false);
  const [hasBankAccount, setHasBankAccount] = useState(false);

const handleSubmit = async (values) => {
  setLoading(true);
  try {
    let imageUrl = ""; // default empty

    const imageFile = values.userImage?.[0]?.originFileObj;
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      const uploadRes = await axios.post(
        "https://hackta-connect-crm-client.vercel.app/api/upload",
        formData
      );

      imageUrl = uploadRes.data.url;
      if (!imageUrl) {
        message.error("Image upload failed. Please try again.");
        setLoading(false);
        return;
      }
    }

    const userData = {
      username: values.username,
      password: values.password,
      role: values.role,
      shift: values.shift,
      agentType: values.agentType,
      agentName: values.agentName,
      branch: values.branch,
      joiningDate: values.joiningDate,
      cnic: values.cnic,
      userImage: imageUrl, // optional field
      CreatedBy: user?.agentName,
      bankaccountstatus: hasBankAccount,
    };

    if (hasBankAccount) {
      userData.accountTitle = values.accountTitle;
      userData.bankName = values.bankName;
      userData.bankNumber = values.bankNumber;
    }

    await API.post("/auth/signup", userData);

    message.success(`User "${values.username}" added successfully!`);
    form.resetFields();
    setHasBankAccount(false);
  } catch (err) {
    console.error("Submission Error:", err);

    if (err.response) {
      message.error(`Error: ${err.response.data.message}`);
    } else if (err.request) {
      message.error("No response from server. Please check your connection.");
    } else {
      message.error("Something went wrong. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        const res = await API.get("auth/check-superadmin");
        setSuperAdminExists(res.data.exists);
      } catch (error) {
        console.error("Error checking super admin:", error);
      }
    };

    checkSuperAdmin();
  }, []);

  return (
    <div className="newUser-container">
      <Card className="newUser-card">
        <h2 className="newUser-title">Add New User</h2>
        <Form
          requiredMark={false}
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="newUser-form"
        >
          <Divider orientation="left">
            <UserOutlined /> Personal Information
          </Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Enter username" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter password"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="agentName"
                label="Full Name"
                rules={[{ required: true, message: "Please enter Full Name" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter Full Name"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="cnic"
                label="CNIC"
                rules={[
                  { message: "Please enter CNIC number" },
                  {
                    pattern: /^[0-9]{13}$/,
                    message: "CNIC must be exactly 13 digits (no dashes)",
                  },
                ]}
              >
                <Input
                  placeholder="Enter 13-digit CNIC (e.g. 3520112345671)"
                  maxLength={13}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="userImage"
                label="Upload User Image"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              
              >
                <Dragger
                  name="file"
                  beforeUpload={() => false}
                  maxCount={1}
                  style={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  accept="image/*"
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area
                  </p>
                </Dragger>
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">
            <FileWordOutlined /> Work Details
          </Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                <Select
                  onChange={(value) => {
                    setSelectedRole(value);
                    if (
                      ["Super Admin", "HR", "Floor Manager"].includes(value)
                    ) {
                      form.setFieldsValue({ shift: "All Shifts" });
                    } else {
                      form.setFieldsValue({ shift: undefined });
                    }
                  }}
                  placeholder="Select role"
                >
                  {/* Only show Super Admin if not already registered */}
                  {!superAdminExists && (
                    <Option value="Super Admin">Super Admin</Option>
                  )}

                  <Option value="HR">HR</Option>
                  <Option value="Floor Manager">Floor Manager</Option>
                  <Option value="Assistant Floor Manager">
                    Assistant Floor Manager
                  </Option>
                  <Option value="Team Lead">Team Lead</Option>
                  <Option value="Team Lead WFH">Team Lead (WFH)</Option>
                  <Option value="QC">Quality Control (QC)</Option>
                  <Option value="agent">Agent</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="shift"
                label="Shift"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select shift">
                  {(selectedRole === "Super Admin" ||
                    selectedRole === "HR" ||
                    selectedRole === "Floor Manager") && (
                    <Option value="allshifts">All Shifts</Option>
                  )}
                  <Option value="morning">Morning</Option>
                  <Option value="evening">Evening</Option>
                  <Option value="night">Night</Option>
                  {/* Extra shifts only for Assistant Floor Manager */}
                  {selectedRole === "Assistant Floor Manager" && (
                    <>
                      <Option value="morning-evening">Morning & Evening</Option>
                      <Option value="evening-night">Evening & Night</Option>
                      <Option value="night-morning">Night & Morning</Option>
                    </>
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="branch"
                label="Branch (A=CM , B=Bahria)"
                rules={[{ required: true, message: "Please select a branch" }]}
              >
                <Select placeholder="Select Branch">
                  {/* ✅ Show only when role is superadmin */}
                  {selectedRole === "Super Admin" && (
                    <Option value="All Branches">All Branches</Option>
                  )}

                  <Option value="Branch A">Branch A</Option>
                  <Option value="Branch B">Branch B</Option>
                </Select>
              </Form.Item>
            </Col>
            {selectedRole === "agent" && (
              <Col xs={24} md={12}>
                <Form.Item
                  name="agentType"
                  label="Agent Type"
                  rules={[
                    { required: true, message: "Please select agent type" },
                  ]}
                >
                  <Select placeholder="Select agent type">
                    <Option value="Office Agent">Office Agent</Option>
                    <Option value="WFH Agent">
                      Work From Home Agent (WFH Agent)
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            )}
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="joiningDate"
                label="Joining Date"
                rules={[
                  { required: true, message: "Please select a joining date" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Select joining date"
                />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">
            <BankOutlined /> Banking Details
          </Divider>

          <Form.Item>
            <Checkbox
              checked={hasBankAccount}
              onChange={(e) => setHasBankAccount(e.target.checked)}
            >
              User has Bank Account
            </Checkbox>
          </Form.Item>

          {hasBankAccount && (
            <>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="bankName" label="Bank Account Name">
                    <Input
                      prefix={<BankOutlined />}
                      placeholder="Enter bank account name"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="bankNumber" label="Bank Account Number">
                    <Input
                      prefix={<BankOutlined />}
                      placeholder="Enter bank account number"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="accountTitle"
                    label="Account Title"
                    rules={[{ message: "Please enter account title" }]}
                  >
                    <Input
                      prefix={<BankOutlined />}
                      placeholder="Enter account title"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          <Form.Item>
            <Button
              style={{
                width: "100%",
                height: "50px",
                backgroundColor: "#1e2d7d",
              }}
              type="primary"
              htmlType="submit"
              className="sumitbutonaddnewuser"
              loading={loading}
            >
              Add User
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddNewUser;
