import React, { useState } from "react";
import { Upload, Card, Table, Typography, message, Progress } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import API from "../../utils/BaseURL";
import "../../styles/UploadAttendanceCSV.css";

const { Dragger } = Upload;
const { Title } = Typography;

const columns = [
  { title: "Field", dataIndex: "field", key: "field" },
  { title: "Type", dataIndex: "type", key: "type" },
  { title: "Expected Values", dataIndex: "expected", key: "expected" },
];

const data = [
  { key: "2", field: "username", type: "String", expected: "Agent's Username" },
  { key: "3", field: "date", type: "Date", expected: "YYYY-MM-DD or ISO Date" },
  { key: "4", field: "status", type: "String (enum)", expected: "pending, Present, Absent, Late, RotationOff, Leave" },
  { key: "5", field: "checkInTime", type: "DateTime (optional)", expected: "ISO format or leave blank" },
  { key: "6", field: "checkOutTime", type: "DateTime (optional)", expected: "ISO format or leave blank" },
  { key: "7", field: "shift", type: "String", expected: "e.g., morning, evening, night" },
  { key: "8", field: "agentType", type: "String", expected: "e.g., WFH Agent, Office Agent" },
  { key: "9", field: "branch", type: "String", expected: "Branch name" },
  { key: "10", field: "updatedBy", type: "String", expected: "User who updated (optional)" },
];

const UploadAttendanceCSV = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (options) => {
    const { file, onSuccess, onError, onProgress } = options;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setProgress(0);

      const res = await API.post("/threetiercsvattendance/upload-csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setProgress(percent);
          onProgress({ percent });
        },
      });

      message.success(res.data.message || "File uploaded successfully!");
      onSuccess("ok");
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Upload failed.");
      onError(error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const props = {
    name: "file",
    customRequest: handleUpload,
    multiple: false,
    accept: ".csv",
    beforeUpload: (file) => {
      const isCSV = file.type === "text/csv";
      if (!isCSV) {
        message.error(`${file.name} is not a CSV file`);
      }
      return isCSV || Upload.LIST_IGNORE;
    },
    onRemove: () => {
      setProgress(0);
      setUploading(false);
    },
  };

  return (
    <div className="upload-attendance-container">
      <Title level={2} className="upload-heading">
        Upload Attendance CSV
      </Title>

      <Dragger {...props} className="csv-uploader" disabled={uploading}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag CSV file to this area to upload</p>
        <p className="ant-upload-hint">Only .csv files are accepted</p>
      </Dragger>

      {uploading && (
        <Card className="csv-progress-card" style={{ marginTop: 16 }}>
          <Progress
            percent={progress}
            status="active"
            strokeColor={{
              from: "#108ee9",
              to: "#87d068",
            }}
            showInfo={true}
          />
        </Card>
      )}

      <Card title="Expected CSV Headers & Format" className="csv-fields-card">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
          scroll={{ x: true }}
          className="csv-fields-table"
        />
      </Card>
    </div>
  );
};

export default UploadAttendanceCSV;
