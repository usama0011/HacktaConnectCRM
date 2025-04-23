import React, { useState, useEffect } from "react";
import {
  Table,
  Typography,
  Avatar,
  Button,
  DatePicker,
  Popover,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  UserOutlined,
  StarOutlined,
  HistoryOutlined,
  IdcardOutlined,
  PlusCircleOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "../../styles/QCPoints.css";
import ProjectInfoCard from "../../components/ProjectInfoCard";
import axios from "axios";

const { Title, Text } = Typography;

const QCPoints = () => {
  const editor = localStorage.getItem("editorName") || "Abdul Moiz";
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);

  const [selectedDate, setSelectedDate] = useState(moment());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [fieldValues, setFieldValues] = useState({});

  const [form] = Form.useForm();

  const openEditModal = (user) => {
    setEditingUser(user);
    const values = {
      time: user.time || "",
      profilePattern: user.profilePattern || "",
      pacePerHour: user.pacePerHour || "",
      perHourReport: user.perHourReport || "",
      workingBehavior: user.workingBehavior || "",
    };
    form.setFieldsValue(values);
    setFieldValues(values);
    setIsModalOpen(true);
  };
  const handleUpdate = async () => {
    const totalPoints = Object.values(fieldValues).filter(
      (v) => v === "1"
    ).length;
    const payload = {
      userId: editingUser._id, // real user id from database
      name: editingUser.name,
      avatar: editingUser.avatar,
      editor,
      date: selectedDate.format("YYYY-MM-DD"),
      values: fieldValues,
    };

    try {
      setIsModalOpen(false);
      message.loading({ content: "Saving...", key: "qc_save" });

      const res = await axios.post(
        "http://localhost:5000/api/qcpoints",
        payload
      );
      const updated = res.data;

      const updatedUsers = users.map((u) =>
        u._id === updated.userId ? { ...u, ...updated } : u
      );

      setUsers(updatedUsers);
      message.success({
        content: "QC Point Saved!",
        key: "qc_save",
        duration: 2,
      });
    } catch (err) {
      message.error("Failed to update QC point");
    }
  };
  const fetchUsersAndPoints = async (date) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/qcpoints?date=${date}`
      );
      setUsers(res.data); // Must match backend shape
    } catch (error) {
      message.error("Failed to fetch QC points");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: (
        <>
          <UserOutlined /> User
        </>
      ),
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="user-info">
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <Text className="user-name">{text}</Text>
          </div>
        </div>
      ),
    },
    {
      title: (
        <>
          <StarOutlined /> Total Points
        </>
      ),
      dataIndex: "totalPoints",
      key: "totalPoints",
    },
    {
      title: (
        <>
          <IdcardOutlined /> Edited By
        </>
      ),
      dataIndex: "editedBy",
      key: "editedBy",
    },
    {
      title: (
        <>
          <HistoryOutlined /> Edit History
        </>
      ),
      key: "history",
      render: (_, record) => (
        <Popover
          title={
            <span>
              <HistoryOutlined style={{ marginRight: 6 }} />
              Edit History
            </span>
          }
          content={
            <div style={{ maxWidth: 250 }}>
              {record.history.map((h, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <Text strong>{h.by}</Text>
                  <br />
                  <Text type="secondary">
                    {h.action === "Edited" ? (
                      <>
                        <EditOutlined style={{ marginRight: 5 }} />
                        Edited on {h.timestamp}
                      </>
                    ) : (
                      <>
                        <PlusCircleOutlined style={{ marginRight: 5 }} />
                        Created on {h.timestamp}
                      </>
                    )}
                  </Text>
                </div>
              ))}
            </div>
          }
          trigger="click"
        >
          <Button
            style={{
              fontWeight: "normal",
              color: "#003c2f",
              textDecoration: "underline",
            }}
            type="link"
          >
            View History
          </Button>
        </Popover>
      ),
    },
    {
      title: (
        <>
          <EditOutlined /> Actions
        </>
      ),
      key: "actions",
      render: (_, record) => (
        <Button
          className="button-68"
          style={{ backgroundColor: "#003c2f" }}
          type="primary"
          icon={<EditOutlined />}
          onClick={() => openEditModal(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  useEffect(() => {
    fetchUsersAndPoints(selectedDate.format("YYYY-MM-DD"));
  }, [selectedDate]);

  return (
    <div className="qcpoints-container">
      <Title style={{ color: "white" }} level={2} className="qcpoints-title">
        QC Points - {selectedDate.format("YYYY-MM-DD")}
      </Title>

      <div className="date-filter">
        <Text style={{ color: "black", marginRight: "10px" }}>
          Select Date:
        </Text>
        <DatePicker
          value={selectedDate}
          onChange={(date) => setSelectedDate(date || moment())}
          className="calendar-picker"
          format="YYYY-MM-DD"
        />
      </div>
      <br />
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        bordered
        className="qupointsAddTable"
      />

      {/* Modal for Editing */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Avatar src={editingUser?.avatar} size="large" />
            <Text strong style={{ fontSize: "16px" }}>
              {editingUser?.name}
            </Text>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null} // We handle buttons manually below
      >
        <Form
          requiredMark={false}
          layout="vertical"
          form={form}
          className="step-form"
        >
          {[
            { key: "time", label: "Time" },
            { key: "profilePattern", label: "Profile Pattern" },
            { key: "pacePerHour", label: "Pace Per Hour" },
            { key: "perHourReport", label: "Per Hour Report" },
            { key: "workingBehavior", label: "Working Behavior" },
          ].map((item, index) => (
            <div key={item.key} className="step-item">
              <div className="step-indicator">
                <span
                  className={`circle ${
                    fieldValues[item.key] === "1"
                      ? "done"
                      : fieldValues[item.key] === "0"
                      ? "failed"
                      : ""
                  }`}
                >
                  {fieldValues[item.key] === "1" ? (
                    <CheckOutlined />
                  ) : fieldValues[item.key] === "0" ? (
                    <CloseOutlined />
                  ) : (
                    ""
                  )}
                </span>

                {index < 4 && <div className="dashed-line" />}
              </div>
              <div className="step-content">
                <Text className="step-label">{item.label}</Text>
                <div className="option-group">
                  <Button
                    style={
                      fieldValues[item.key] === "1"
                        ? { backgroundColor: "#003c2f" }
                        : { backgroundColor: "transparent" }
                    }
                    type={fieldValues[item.key] === "1" ? "primary" : "default"}
                    onClick={() => {
                      const updated = { ...fieldValues, [item.key]: "1" };
                      setFieldValues(updated);
                      form.setFieldValue(item.key, "1");
                    }}
                  >
                    1
                  </Button>

                  <Button
                    type={fieldValues[item.key] === "0" ? "primary" : "default"}
                    danger
                    onClick={() => {
                      const updated = { ...fieldValues, [item.key]: "0" };
                      setFieldValues(updated);
                      form.setFieldValue(item.key, "0");
                    }}
                  >
                    0
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Custom Footer Buttons */}
          <div className="modal-button-group">
            <Button
              onClick={() => setIsModalOpen(false)}
              className="cancel-btn"
            >
              Cancel
            </Button>
            <Button type="primary" onClick={handleUpdate} className="save-btn">
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default QCPoints;
