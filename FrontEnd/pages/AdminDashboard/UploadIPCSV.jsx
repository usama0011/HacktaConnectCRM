import React, { useState } from "react";
import { Upload, Card, Table, Typography, message, Progress } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import API from "../../utils/BaseURL";
import "../../styles/UploadIPCSV.css";

const { Dragger } = Upload;
const { Title } = Typography;

const columns = [
  { title: "Field", dataIndex: "field", key: "field" },
  { title: "Type", dataIndex: "type", key: "type" },
  { title: "Expected Values", dataIndex: "expected", key: "expected" },
];

const data = [
  { key: "2", field: "username", type: "String", expected: "Agent's username" },
  { key: "3", field: "date", type: "Date", expected: "YYYY-MM-DD or ISO" },
  { key: "4", field: "clicks", type: "Number", expected: "e.g., 100" },
  { key: "5", field: "sessions", type: "Number", expected: "e.g., 25" },
  { key: "6", field: "status", type: "String", expected: "Any defined status" },
  { key: "8", field: "shift", type: "String", expected: "morning, evening, night" },
  { key: "9", field: "agentType", type: "String", expected: "WFH Agent, Office Agent" },
  { key: "10", field: "branch", type: "String", expected: "Branch name" },
];

const UploadIPCSV = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (options) => {
    const { file, onSuccess, onError, onProgress } = options;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setProgress(0);

      const res = await API.post("/threetiercsv/upload-csv", formData, {
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
    <div className="upload-ipcsv-container">
      <Title level={2} className="upload-ipcsv-heading">
        Upload IPs Data CSV
      </Title>

      <Dragger {...props} className="ipcsv-dragger" disabled={uploading}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag CSV file to this area to upload
        </p>
        <p className="ant-upload-hint">Only CSV format is supported</p>
      </Dragger>

      {uploading && (
        <Card className="ipcsv-progress-card" style={{ marginTop: 16 }}>
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

      <Card title="Expected CSV Headers & Format" className="ipcsv-info-card">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
          scroll={{ x: true }}
          className="ipcsv-fields-table"
        />
      </Card>
    </div>
  );
};

export default UploadIPCSV;
