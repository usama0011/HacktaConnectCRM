import React from "react";
import { Card, Form, Input, Button, Typography, Checkbox } from "antd";
import { LockOutlined, UserOutlined, GoogleOutlined } from "@ant-design/icons";
import "../../styles/Login.css";
import MainWebSiteLogo from "../../src/assets/mainlogo.jpeg";
import LoginBanner from "../../src/assets/loginbanner.jpg";

const { Title, Text } = Typography;

const Login = () => {
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
          <Form layout="vertical" className="login-form">
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
              <Button type="primary" htmlType="submit" className="login-button">
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
