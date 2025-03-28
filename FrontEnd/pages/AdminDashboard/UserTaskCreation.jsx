import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Typography,
  message,
} from "antd";
import moment from "moment";
import "../../styles/UserTaskCreation.css";

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

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [selectedObservers, setSelectedObservers] = useState([]);
  const [taskSummary, setTaskSummary] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [finishDate, setFinishDate] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [duration, setDuration] = useState("");

  const maxSummaryLength = 2000;
  const [form] = Form.useForm();

  // Handle Task Submission
  const handleTaskSubmit = (values) => {
    if (!selectedUser) {
      return message.error("Please select an assignee.");
    }
    console.log("Task Assigned to:", selectedUser, values);
    message.success(`Task assigned successfully!`);
    form.resetFields();
    setSelectedUser(null);
    setSelectedParticipants([]);
    setSelectedObservers([]);
    setTaskSummary("");
    setStartDate(null);
    setFinishDate(null);
    setDeadline(null);
    setDuration("");
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
          onFinish={handleTaskSubmit}
        >
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
              value={taskSummary}
              onChange={(e) => {
                const inputText = e.target.value;
                if (inputText.length <= maxSummaryLength) {
                  setTaskSummary(inputText);
                }
              }}
            />
            <Text className="char-count">
              {taskSummary.length}/{maxSummaryLength} characters
            </Text>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
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
