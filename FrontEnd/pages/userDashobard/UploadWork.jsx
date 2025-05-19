import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  Table,
  Row,
  Col,
  Typography,
  message,
} from "antd";
import {
  UploadOutlined,
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import API from "../../utils/BaseURL";
import moment from "moment";
import "../../styles/UploadWork.css";
import { useUserContext } from "../../context/UserContext";

const { Title, Text } = Typography;
const UploadWork = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const { user } = useUserContext();
  console.log(user._id);

  const columns = [
    {
      title: (
        <span>
          <UserOutlined style={{ marginRight: 5 }} />
          Username
        </span>
      ),
      dataIndex: "username",
      key: "username",
      render: (text) => (
        <span className="uploadwork-username">
          <UserOutlined /> {text}
        </span>
      ),
    },
    {
      title: (
        <span>
          <CalendarOutlined style={{ marginRight: 5 }} />
          Date Submitted
        </span>
      ),
      dataIndex: "date",
      key: "date",
      render: (text) => (
        <span className="uploadwork-date">
          <CalendarOutlined /> {moment(text).format("YYYY-MM-DD")}
        </span>
      ),
    },
    {
      title: (
        <span>
          <CheckCircleOutlined style={{ marginRight: 5, color: "#52c41a" }} />
          Clicks
        </span>
      ),
      dataIndex: "clicks",
      key: "clicks",
      render: (text) => (
        <span>
          <CheckCircleOutlined style={{ marginRight: 5, color: "#52c41a" }} />
          {text}
        </span>
      ),
    },
    {
      title: (
        <span>
          <CheckCircleOutlined style={{ marginRight: 5, color: "#1890ff" }} />
          Sessions
        </span>
      ),
      dataIndex: "sessions",
      key: "sessions",
      render: (text) => (
        <span>
          <CheckCircleOutlined style={{ marginRight: 5, color: "#1890ff" }} />
          {text}
        </span>
      ),
    },
    {
      title: (
        <span>
          <CheckCircleOutlined style={{ marginRight: 5, color: "#1890ff" }} />
          Status
        </span>
      ),
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        let icon = <ClockCircleOutlined />;
        let text = status;

        if (status === "Present") {
          color = "green";
          icon = <CheckCircleOutlined />;
        } else if (status === "Absent") {
          color = "red";
          icon = <CloseCircleOutlined />;
        } else if (status === "Late") {
          color = "orange";
          icon = <ClockCircleOutlined />;
        } else if (status === "Pending") {
          color = "blue";
          icon = <ClockCircleOutlined />;
        }

        return (
          <span className="uploadwork-status-tag">
            <span className={`status-tag ${status.toLowerCase()}`}>
              {icon} {text}
            </span>
          </span>
        );
      },
    },
  ];

  // Set today's date by default
  useEffect(() => {
    form.setFieldsValue({ date: moment() });
  }, [form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        username: values.username,
        date: values.date.toISOString(),
        clicks: Number(values.clicks),
        sessions: Number(values.sessions),
        status: "Pending",
        avatar: user?.userImage,
        branch: user?.branch,
        agentType: user?.agentType,
        shift: user?.shift,
      };

      // ✅ Submit IP work data
      await API.post("/ip/submit", payload);

      // ✅ Mark Checkout Time for Agent
      if (user.role === "agent") {
        await API.put("/attendance/checkout", {
          userId: user._id,
        });
        message.success("Work recorded and checkout marked successfully!");
      } else {
        message.success("Work recorded successfully!");
      }

      form.resetFields();
      form.setFieldsValue({ date: moment() });
    } catch (err) {
      console.error(err);
      message.error(err?.response?.data?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.username) {
      form.setFieldsValue({
        username: user.username,
        date: moment(),
      });
    }
  }, [form, user]);
  useEffect(() => {
    const fetchUserWorkData = async () => {
      try {
        if (user?._id) {
          const res = await API.get(`/ip/${user._id}`);
          setDataSource(res.data.ipRecords); // Assuming your backend sends an array
        }
      } catch (err) {
        console.error(err);
        message.error("Failed to fetch submitted work data.");
      }
    };

    fetchUserWorkData();
  }, [user]);

  return (
    <div className="uploadwork-container">
      <Text className="uploadwork-subtext">
        Submit your daily work logs and track your progress efficiently.
      </Text>

      <Card className="uploadwork-card">
        <Form
          requiredMark={false}
          layout="vertical"
          className="uploadwork-form"
          form={form}
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            {/* Username */}
            <Col xs={24} sm={12}>
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please enter your username" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  disabled
                  placeholder="Auto-filled username"
                />
              </Form.Item>
            </Col>

            {/* Date */}
            <Col xs={24} sm={12}>
              <Form.Item
                disabled
                label="Date"
                name="date"
                rules={[{ required: true, message: "Please select the date" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  suffixIcon={<CalendarOutlined />}
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            {/* Clicks */}
            <Col xs={24} sm={12}>
              <Form.Item
                label="Total Clicks"
                name="clicks"
                rules={[
                  { required: true, message: "Please enter total clicks" },
                ]}
              >
                <Input
                  type="number"
                  prefix={<CheckCircleOutlined />}
                  placeholder="Enter total clicks"
                />
              </Form.Item>
            </Col>

            {/* Sessions */}
            <Col xs={24} sm={12}>
              <Form.Item
                label="Total Sessions"
                name="sessions"
                rules={[
                  { required: true, message: "Please enter total sessions" },
                ]}
              >
                <Input
                  type="number"
                  prefix={<CheckCircleOutlined />}
                  placeholder="Enter total sessions"
                />
              </Form.Item>
            </Col>
          </Row>
          {/* Submit Button (Full Width) */}
          <Form.Item>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              className="uploadwork-button"
              loading={loading}
              htmlType="submit"
            >
              Submit Work
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* here data is show after like farak one day date one day uploaded  */}

      <Card className="uploadwork-table-card">
        <Title level={4} className="uploadwork-table-title">
          Your Performance
        </Title>
        <Table
          dataSource={dataSource}
          columns={columns}
          className="user-table"
          pagination={{ pageSize: 5 }}
          rowKey="_id"
        />
      </Card>
    </div>
  );
};

export default UploadWork;
