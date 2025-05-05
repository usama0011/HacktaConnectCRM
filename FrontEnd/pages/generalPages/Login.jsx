import React, { useState } from "react";
import { Card, Form, Input, Button, Typography, Checkbox, message } from "antd";
import { LockOutlined, UserOutlined, GoogleOutlined } from "@ant-design/icons";
import "../../styles/Login.css";
import MainWebSiteLogo from "../../src/assets/mainlogo.jpeg";
import LoginBanner from "../../src/assets/loginbanner.jpg";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import API from "../../utils/BaseURL";
const { Title, Text } = Typography;
const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUserContext();

  const handleLogin = async (values) => {
    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        username: values.email,
        password: values.password,
      });

      const { user, token } = res.data;

      const shift = (user.shift || "").toLowerCase(); // Normalize to lowercase

      const shiftTimes = {
        morning: { start: 8 * 60, end: 16 * 60 }, // 08:00 - 16:00
        evening: { start: 16 * 60, end: 24 * 60 }, // 16:00 - 00:00
        night: { start: 0, end: 8 * 60 }, // 00:00 - 08:00
      };

      const shiftTimings = {
        morning: "08:00 AM - 04:00 PM",
        evening: "04:00 PM - 12:00 AM",
        night: "12:00 AM - 08:00 AM",
      };

      const shiftConfig = shiftTimes[shift];
      const adminRoles = [
        "Super Admin",
        "HR",
        "Floor Manager",
        "Assistant Floor Manager",
      ];

      const isAdmin = adminRoles.includes(user.role);

      const now = new Date();
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();
      const totalCurrentMinutes = currentHour * 60 + currentMinutes;

      // ✅ For Non-Admins: Validate Shift
      if (!isAdmin) {
        if (!shiftConfig) {
          setLoading(false);
          return message.error("Your shift is not recognized. Contact admin.");
        }

        const { start, end } = shiftConfig;

        const isInShift =
          shift === "night"
            ? totalCurrentMinutes >= 0 && totalCurrentMinutes < 480
            : totalCurrentMinutes >= start && totalCurrentMinutes < end;

        if (!isInShift) {
          setLoading(false);
          const readableTime = shiftTimings[shift] || "Unknown Timing";
          return message.error(
            `You can only login during your shift hours (${user.shift} Shift: ${readableTime}).`
          );
        }

        // ✅ Mark attendance and check for lateness
        const minutesLate = totalCurrentMinutes - start;
        const markAttendancePayload = {
          userId: user._id,
          username: user.username,
          ...(minutesLate > 40 ? { status: "Late" } : {}),
        };

        try {
          await API.post("/attendance/mark", markAttendancePayload);
        } catch (err) {
          console.warn(
            "Attendance marking skipped:",
            err.response?.data?.message
          );
        }
      } else {
        // ✅ Admins get normal attendance marking
        try {
          await API.post("/attendance/mark", {
            userId: user._id,
            username: user.username,
          });
        } catch (err) {
          console.warn(
            "Admin attendance marking skipped:",
            err.response?.data?.message
          );
        }
      }

      // ✅ Login Success
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      login(user, token);

      message.success("Login successful!");

      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Login failed.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Section - Login Form */}
      <div className="login-form-container">
        <img src={MainWebSiteLogo} alt="Brand Logo" className="login-logo" />
        <Title level={2} className="login-welcome">
          Welcome back
        </Title>
        <Text className="login-subtext">Please enter your details</Text>

        <Card className="login-card">
          <Form
            requiredMark={false}
            layout="vertical"
            className="login-form"
            onFinish={handleLogin}
          >
            {/* Email Input */}
            <Form.Item
              label="Email address"
              name="email"
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter your email" />
            </Form.Item>

            {/* Password Input */}
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
              />
            </Form.Item>

            {/* Remember Me & Forgot Password */}
            <div className="login-options">
              <Checkbox>Remember for 30 days</Checkbox>
              <Text className="forgot-password">Forgot password?</Text>
            </div>

            {/* Login Button */}
            <Form.Item>
              <Button
                disabled={loading}
                type="primary"
                htmlType="submit"
                className="login-button"
              >
                Sign in
              </Button>
            </Form.Item>

            {/* Google Sign-in */}
            <Button icon={<GoogleOutlined />} className="google-login">
              Sign in with Google
            </Button>

            {/* Signup Link */}
            <Text className="signup-text">
              Don’t have an account? <a href="/signup">Sign up</a>
            </Text>
          </Form>
        </Card>
      </div>

      {/* Right Section - Illustration with SVG Shapes */}
      <div className="login-illustration">
        <div className="svg-container">
          <svg className="svg-shape top-left" viewBox="0 0 100 100" fill="none">
            <circle
              cx="50"
              cy="50"
              r="20"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          <svg
            className="svg-shape bottom-right"
            viewBox="0 0 100 100"
            fill="none"
          >
            <rect
              x="20"
              y="20"
              width="60"
              height="60"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          <svg
            className="svg-shape zigzag-wave"
            viewBox="0 0 100 100"
            fill="none"
          >
            <path
              d="M10 50 L30 30 L50 50 L70 30 L90 50"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          <svg className="svg-shape hexagon" viewBox="0 0 100 100" fill="none">
            <polygon
              points="50,10 90,30 90,70 50,90 10,70 10,30"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          <svg className="svg-shape zigzag" viewBox="0 0 100 100" fill="none">
            <path
              d="M10 30 L30 50 L50 30 L70 50 L90 30"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          <svg
            className="svg-shape dotted-grid"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle cx="20" cy="20" r="2" fill="white" />
            <circle cx="40" cy="20" r="2" fill="white" />
            <circle cx="60" cy="20" r="2" fill="white" />
            <circle cx="80" cy="20" r="2" fill="white" />

            <circle cx="20" cy="40" r="2" fill="white" />
            <circle cx="40" cy="40" r="2" fill="white" />
            <circle cx="60" cy="40" r="2" fill="white" />
            <circle cx="80" cy="40" r="2" fill="white" />

            <circle cx="20" cy="60" r="2" fill="white" />
            <circle cx="40" cy="60" r="2" fill="white" />
            <circle cx="60" cy="60" r="2" fill="white" />
            <circle cx="80" cy="60" r="2" fill="white" />

            <circle cx="20" cy="80" r="2" fill="white" />
            <circle cx="40" cy="80" r="2" fill="white" />
            <circle cx="60" cy="80" r="2" fill="white" />
            <circle cx="80" cy="80" r="2" fill="white" />
          </svg>

          <img
            src={LoginBanner}
            alt="Illustration"
            className="illustration-img"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
