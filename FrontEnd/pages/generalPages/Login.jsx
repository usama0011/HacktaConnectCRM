import React, { useState } from "react";
import { Card, Form, Input, Button, Typography, Checkbox, message } from "antd";
import { LockOutlined, UserOutlined, GoogleOutlined } from "@ant-design/icons";
import "../../styles/Login.css";
import MainWebSiteLogoo from "../../src/assets/mainlogo.jpeg";
import MainWebSiteLogooo from "../../src/assets/mainlogo.png";
import LoginBanner from "../../src/assets/10315339.jpg";
import LoginBannerrrrr from "../../src/assets/thistime.png";
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

      // ✅ API Call to login
      const res = await API.post("/auth/login", {
        username: values.email,
        password: values.password,
      });

      const { user, token } = res.data;

      // ✅ Store user and token in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      login(user, token);

      message.success("Login successful!");

      // ✅ If the user is an agent, mark attendance
      if (user.role === "agent") {
        await API.post("/attendance/mark", {
          userId: user._id,
          username: user.username,
          shift: user.shift,
          agentType: user.agentType || null,
          branch: user.branch || null,
        });
        message.success("Attendance marked for agent.");
      }

      // ✅ Navigate to the appropriate dashboard
      const adminRoles = [
        "Super Admin",
        "HR",
        "Team Lead",
        "Floor Manager",
        "Assistant Floor Manager",
      ];

      if (adminRoles.includes(user.role)) {
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
        <img src={MainWebSiteLogoo} alt="Brand Logo" className="login-logo" />
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
                className={`login-button ${loading ? "loading-wave" : ""}`}
              >
                {loading ? "Signing in..." : "Sign in"}
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
          <div>
            <img
              src={MainWebSiteLogoo}
              alt="Brand Logo"
              className="login-logo"
            />

            <h1 className="hacktaconnectdiigtalogo">
              <span
                style={{
                  fontSize: "40px",
                  textTransform: "uppercase",
                  color: "white",
                }}
                className="hacktagigi"
              >
                Hackta Connect
              </span>{" "}
              <br />{" "}
              <span
                className="smalldescipiot"
                style={{
                  textTransform: "capitalize",
                  color: "white",
                  fontSize: "20px",
                }}
              >
                Digital World of tech
              </span>
            </h1>
            <br />
            <br />
            <img
              className="zindtope"
              style={{
                width: "100%",
                height: "350px",
                borderRadius: "10px",
                zIndex: 999,
              }}
              src={LoginBanner}
              alt=""
            />
            <img
              className="letchakeiuer"
              style={{ width: "100%", height: "300px" }}
              src={LoginBannerrrrr}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
