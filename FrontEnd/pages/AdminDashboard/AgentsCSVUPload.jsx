import React, { useState } from "react";
import {
  Upload,
  message,
  Typography,
  Spin,
  Button,
  Card,
  Row,
  Col,
  Divider,
  Modal,
  Input,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import "../../styles/AgentsCSVUpload.css";
import { useUserContext } from "../../context/UserContext";
import API from "../../utils/BaseURL";
import {
  FileTextOutlined,
  LockOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
const { Dragger } = Upload;
const { Title, Paragraph } = Typography;

const UploadCard = ({
  title,
  file,
  setFile,
  uploading,
  handleUpload,
  setUploadTarget,
  setIsPasswordModalVisible
}) => {
  const props = {
    name: "file",
    multiple: false,
    accept: ".csv",
    beforeUpload: (file) => {
      setFile(file);
      return false;
    },
    onRemove: () => setFile(null),
    fileList: file ? [file] : [],
  };

  return (
    <Card className="csv-upload-card" title={title} bordered={false} hoverable>
      <Dragger {...props} className="csv-dragger" disabled={uploading}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag CSV file to this area</p>
        <p className="ant-upload-hint">Only .csv files are accepted</p>
      </Dragger>
      <Button
        type="primary"
        icon={<InboxOutlined />}
        onClick={() => {
          setUploadTarget(title.includes("Without") ? "noBank" : "withBank");
          setIsPasswordModalVisible(true);
        }}
        disabled={!file || uploading}
        loading={uploading}
        block
        style={{ marginTop: 16 }}
      >
        Upload CSV
      </Button>
      {uploading && (
        <div className="upload-loading-wave">
          <Spin size="large" tip="Uploading..." />
        </div>
      )}
    </Card>
  );
};

const AgentsCSVUpload = () => {
  const defaultImageURL =
    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";

  const { user } = useUserContext();

  // With bank states
  const [fileWithBank, setFileWithBank] = useState(null);
  const [uploadingWithBank, setUploadingWithBank] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [uploadTarget, setUploadTarget] = useState("");
  // Without bank states
  const [fileNoBank, setFileNoBank] = useState(null);
  const [uploadingNoBank, setUploadingNoBank] = useState(false);

  const handleUploadWithBank = async () => {
    if (!fileWithBank) {
      message.warning("Please select a CSV file first.");
      return;
    }

    setUploadingWithBank(true);
    const formData = new FormData();
    formData.append("csv", fileWithBank);
    formData.append(
      "CreatedBy",
      user?.agentName || user?.username || "Unknown"
    );

    try {
      await API.post("/auth/upload-csv/with-bank", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success(`${fileWithBank.name} uploaded successfully`);
      setFileWithBank(null);
    } catch (error) {
      message.error("Upload failed.");
    } finally {
      setUploadingWithBank(false);
    }
  };

  const handleUploadNoBank = async () => {
    if (!fileNoBank) {
      message.warning("Please select a CSV file first.");
      return;
    }

    setUploadingNoBank(true);
    const formData = new FormData();
    formData.append("csv", fileNoBank);
    formData.append(
      "CreatedBy",
      user?.agentName || user?.username || "Unknown"
    );

    try {
      await API.post("/auth/upload-csv/no-bank", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success(`${fileNoBank.name} uploaded successfully`);
      setFileNoBank(null);
    } catch (error) {
      message.error("Upload failed.");
    } finally {
      setUploadingNoBank(false);
    }
  };
  const confirmPasswordAndUpload = () => {
    if (passwordInput === "muix@123") {
      if (uploadTarget === "withBank") {
        handleUploadWithBank();
      } else if (uploadTarget === "noBank") {
        handleUploadNoBank();
      }
      setIsPasswordModalVisible(false);
      setPasswordInput("");
    } else {
      message.error("Incorrect password.");
    }
  };

  return (
    <div className="csv-upload-container">
      <Title level={2} className="csv-upload-title">
        Upload Agent CSV Records
      </Title>
      <Paragraph className="csv-upload-description">
        Upload bulk agent records with or without bank information.
      </Paragraph>

      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={12} md={10}>
          <UploadCard
            title="Upload CSV (With Bank Account)"
            file={fileWithBank}
            setFile={setFileWithBank}
            uploading={uploadingWithBank}
            handleUpload={handleUploadWithBank}
            setUploadTarget={setUploadTarget}
            setIsPasswordModalVisible={setIsPasswordModalVisible}
          />
        </Col>
        <Col xs={24} sm={12} md={10}>
          <UploadCard
            title="Upload CSV (Without Bank Account)"
            file={fileNoBank}
            setFile={setFileNoBank}
            uploading={uploadingNoBank}
            handleUpload={handleUploadNoBank}
            setUploadTarget={setUploadTarget}
            setIsPasswordModalVisible={setIsPasswordModalVisible}
          />
        </Col>
      </Row>
      <Divider style={{ marginTop: 40 }} />
       <div className="titlanddescsv">
        <Title level={4}>
        <FileTextOutlined style={{ marginRight: 8 }} />
        CSV Upload Instructions
      </Title>

      <Paragraph>
        Please follow the format guidelines below to ensure a successful CSV
        upload.
      </Paragraph>
       </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Fields Required for All Users" bordered={false}>
            <ul className="csv-guide-list">
              <li>
                <strong>username</strong>: Unique login name (e.g., john.doe01)
              </li>
              <li>
                <strong>password</strong>: User password (plain or hashed)
              </li>
              <li>
                <strong>role</strong>: Role of the user (e.g., agent)
              </li>
              <li>
                <strong>shift</strong>: Shift (morning, evening, night)
              </li>
              <li>
                <strong>agentType</strong>: Office Agent / WFH Agent
              </li>
              <li>
                <strong>agentName</strong>: Full name (e.g., John Doe)
              </li>
              <li>
                <strong>branch</strong>: Branch A, Branch B, or All Branches
              </li>
              <li>
                <strong>joiningDate</strong>: YYYY-MM-DD format (e.g.,
                2023-01-01)
              </li>
              <li>
                <strong>cnic</strong>: 13-digit number (e.g., 3520112345671)
              </li>
            </ul>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Fields Only for Bank Account Uploads" bordered={false}>
            <ul className="csv-guide-list">
              <li>
                <strong>accountTitle</strong>: Account holder name
              </li>
              <li>
                <strong>bankName</strong>: Name of the bank (e.g., HBL)
              </li>
              <li>
                <strong>Account No</strong>: Valid account number
              </li>
            </ul>
          </Card>
        </Col>
      </Row>
      <br />
      <Card style={{ textAlign: "lefts" }}>
        <Paragraph style={{ marginTop: 24, textAlign: "left" }}>
          <LockOutlined style={{ marginRight: 6, textAlign: "left" }} />
          <strong>Note:</strong> The <code>CreatedBy</code> and{" "}
          <code>bankaccountstatus</code> fields are automatically handled. Do
          not include them manually.
        </Paragraph>

        <Paragraph>
          <PaperClipOutlined style={{ marginRight: 6 }} />
          <strong>Ensure:</strong>
          <ul className="csv-guide-list">
            <li>CSV column headers match exactly</li>
            <li>No extra or missing columns</li>
            <li>
              Date is in <code>YYYY-MM-DD</code> format
            </li>
            <li>CNIC is 13 digits, no dashes</li>
          </ul>
        </Paragraph>
      </Card>
      <Modal
        title="Enter Upload Password"
        open={isPasswordModalVisible}
        onCancel={() => {
          setIsPasswordModalVisible(false);
          setPasswordInput("");
        }}
        onOk={confirmPasswordAndUpload}
        okText="Upload"
      >
        <Input.Password
          placeholder="Enter password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default AgentsCSVUpload;
