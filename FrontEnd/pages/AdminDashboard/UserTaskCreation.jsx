import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Typography,
  message,
  Upload,
} from "antd";
import moment from "moment";
import "../../styles/UserTaskCreation.css";
import ProjectInfoCard from "../../components/ProjectInfoCard";
import axios from "axios";

const { Title, Text } = Typography;
const { Option } = Select;

const UserTaskCreation = () => {
  // Dummy user data
  const dummyUsers = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Robert Brown" },
    { id: "4", name: "Emily Johnson" },
    { id: "5", name: "Michael Davis" },
  ];
  const imageOptions = [
    "https://res.cloudinary.com/dcgwywlvg/image/upload/v1743946739/Image_2_kpe6vp.png",
    "https://res.cloudinary.com/dcgwywlvg/image/upload/v1743946739/Image_1_hgdyg6.png",
    "https://res.cloudinary.com/dcgwywlvg/image/upload/v1743946720/Image_3_aht53l.png",
    "https://res.cloudinary.com/dcgwywlvg/image/upload/v1743946720/Image_10_kzaocd.png",
    "https://res.cloudinary.com/dcgwywlvg/image/upload/v1743946720/Image_4_xzospg.png",
    "https://res.cloudinary.com/dcgwywlvg/image/upload/v1743946720/Image_8_yga0vi.png",
    "https://res.cloudinary.com/dcgwywlvg/image/upload/v1743946720/Image_11_xor4z7.png",
    "https://res.cloudinary.com/dcgwywlvg/image/upload/v1743946720/Image_5_hlkncl.png",
    "https://res.cloudinary.com/dcgwywlvg/image/upload/v1743946720/Image_7_g7b04x.png",
    "https://res.cloudinary.com/dcgwywlvg/image/upload/v1743946720/Image_9_cl402p.png",
    "https://res.cloudinary.com/dcgwywlvg/image/upload/v1743946720/Upload_Image_nmkj3w.png",
  ];

  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [selectedObservers, setSelectedObservers] = useState([]);
  const [taskSummary, setTaskSummary] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [finishDate, setFinishDate] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [duration, setDuration] = useState("");

  const maxSummaryLength = 2000;
  const [form] = Form.useForm();

  const handleTaskSubmit = async (values) => {
    if (!selectedUser) {
      return message.error("Please select an assignee.");
    }

    setLoading(true);
    try {
      const payload = {
        assignee: selectedUser,
        createdBy: "Admin",
        participants: selectedParticipants,
        observers: selectedObservers,
        deadline: deadline ? moment(deadline).format("YYYY-MM-DD") : null,
        startDate: startDate ? moment(startDate).format("YYYY-MM-DD") : null,
        finishDate: finishDate ? moment(finishDate).format("YYYY-MM-DD") : null,
        duration,
        taskSummary: values.taskSummary,
        taskImage: values.taskImage, // ✅ include image
      };
      console.log(payload);
      await axios.post("http://localhost:5000/api/tasks/assign", payload);
      message.success("Task assigned successfully!");

      form.resetFields();
      setSelectedUser(null);
      setSelectedImage(null); // also reset the image UI
      setSelectedParticipants([]);
      setSelectedObservers([]);
      setTaskSummary("");
      setStartDate(null);
      setFinishDate(null);
      setDeadline(null);
      setDuration("");
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to assign task.");
    } finally {
      setLoading(false);
    }
  };

  // Disable past dates
  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  };

  // Auto-calculate duration
  const handleFinishDateChange = (date) => {
    if (deadline && date.isAfter(deadline)) {
      message.error("Finish date cannot be after the deadline!");
      return;
    }
    setFinishDate(date);
    if (startDate && date) {
      const diff = date.diff(startDate, "days");
      setDuration(diff >= 0 ? `${diff} days` : "Invalid selection");
    }
  };

  return (
    <div className="user-task-container">
      <Card className="user-task-card">
        <Title level={2} className="user-task-title">
          Task Assignment
        </Title>

        <Form
          requiredMark={false}
          form={form}
          layout="vertical"
          className="userTaskCreationINput"
          onFinish={handleTaskSubmit}
        >
          <Form.Item
            label="Select Task Image"
            name="taskImage"
            className="image-selection"
          >
            <div className="image-grid">
              {imageOptions.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`task-${index}`}
                  className={`selectable-image ${
                    selectedImage === url ? "selected" : ""
                  }`}
                  onClick={() => {
                    form.setFieldsValue({ taskImage: url });
                    setSelectedImage(url);
                  }}
                />
              ))}
            </div>
          </Form.Item>

          {/* Assignee Selection (Only one user) */}
          <Form.Item label="Assignee">
            <Select
              placeholder="Select Assignee"
              value={selectedUser}
              onChange={setSelectedUser}
              style={{ width: "100%" }}
            >
              {dummyUsers.map((user) => (
                <Option key={user.id} value={user.name}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Created By (Pre-selected user) */}
          <Form.Item label="Created By">
            <Select disabled defaultValue="Admin">
              <Option value="Admin">Admin</Option>
            </Select>
          </Form.Item>

          {/* Participants */}
          <Form.Item label="Participants">
            <Select
              mode="multiple"
              placeholder="+ Add"
              value={selectedParticipants}
              onChange={setSelectedParticipants}
              style={{ width: "100%" }}
            >
              {dummyUsers.map((user) => (
                <Option key={user.id} value={user.name}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Observers */}
          <Form.Item label="Observers">
            <Select
              mode="multiple"
              placeholder="+ Add"
              value={selectedObservers}
              onChange={setSelectedObservers}
              style={{ width: "100%" }}
            >
              {dummyUsers.map((user) => (
                <Option key={user.id} value={user.name}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Deadline */}
          <Form.Item label="Deadline">
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Select Deadline"
              disabledDate={disabledDate}
              onChange={setDeadline}
            />
          </Form.Item>

          {/* Task Start & End Date */}
          <div className="date-time-container">
            <Form.Item label="Start Task On">
              <DatePicker
                style={{ width: "100%" }}
                disabledDate={disabledDate}
                onChange={setStartDate}
              />
            </Form.Item>
            <Form.Item label="Duration">
              <Input value={duration} disabled style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Finish">
              <DatePicker
                style={{ width: "100%" }}
                disabledDate={disabledDate}
                onChange={handleFinishDateChange}
              />
            </Form.Item>
          </div>

          {/* Task Description */}
          <Form.Item>
            <Form.Item
              label="Task Summary"
              name="taskSummary"
              rules={[
                { required: true, message: "Please enter the task summary" },
                {
                  max: maxSummaryLength,
                  message: `Maximum ${maxSummaryLength} characters allowed`,
                },
              ]}
            >
              <Input.TextArea
                rows={5}
                placeholder="Enter task summary (Max 2000 characters)"
                onChange={(e) => {
                  const inputText = e.target.value;
                  // You can still track summary for display
                  form.setFieldsValue({ taskSummary: inputText });
                }}
              />
            </Form.Item>

            {/* Show character count separately */}
            <Text className="char-count">
              {(form.getFieldValue("taskSummary") || "").length}/
              {maxSummaryLength} characters
            </Text>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="assign-task-btn"
            >
              Assign Task
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UserTaskCreation;
