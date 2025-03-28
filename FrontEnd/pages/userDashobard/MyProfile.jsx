import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Typography,
  Upload,
  message,
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import "../../styles/MyProfile.css";

const { Title, Text } = Typography;

const MyProfile = () => {
  const [form] = Form.useForm();
  const [profileImage, setProfileImage] = useState(null);

  // Handle profile image upload
  const handleUpload = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} uploaded successfully.`);
      setProfileImage(URL.createObjectURL(info.file.originFileObj));
    }
  };

  return (
    <div className="myprofile-container">
      <Title level={2} className="myprofile-title">
        My Profile
      </Title>
      <Text className="myprofile-subtext">Manage your profile details</Text>

      {/* Profile Card */}
      <Card className="myprofile-card">
        {/* Avatar Upload Section */}
        <div className="myprofile-avatar-section">
          <Avatar
            size={100}
            src={profileImage}
            icon={!profileImage && <UserOutlined />}
          />
          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleUpload}
          >
            <Button
              icon={<UploadOutlined />}
              className="myprofile-upload-button"
            >
              Change Profile Picture
            </Button>
          </Upload>
        </div>

        {/* Profile Information Form */}
        <Form layout="vertical" form={form} className="myprofile-form">
          <Form.Item label="Full Name" name="fullname">
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your full name"
            />
          </Form.Item>

          <Form.Item label="Email Address" name="email">
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter your email"
              disabled
            />
          </Form.Item>

          <Form.Item label="Phone Number" name="phone">
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Enter your phone number"
            />
          </Form.Item>

          <Form.Item label="Current Password" name="currentPassword">
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter current password"
            />
          </Form.Item>

          <Form.Item label="New Password" name="newPassword">
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter new password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" className="myprofile-save-button">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default MyProfile;
