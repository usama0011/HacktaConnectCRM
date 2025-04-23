import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Typography,
  Upload,
  message,
  Spin,
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import "../../styles/MyProfile.css";
import axios from "axios";
import { useUserContext } from "../../context/UserContext";

const { Title, Text } = Typography;

const MyProfile = () => {
  const [form] = Form.useForm();
  const { user, token } = useUserContext();
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/user/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = res.data;
        setProfileImage(userData.userImage);
        form.setFieldsValue({
          username: userData.username,
          role: userData.role,
          shift: userData.shift,
          bankName: userData.bankName,
          bankNumber: userData.bankNumber,
        });
      } catch (error) {
        message.error("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchUserDetails();
    }
  }, [user]);

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

      <Card className="myprofile-card">
        {loading ? (
          <Spin size="large" />
        ) : (
          <>
            <div className="myprofile-avatar-section">
              <Avatar
                className="usersideavatarsir"
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

            <Form layout="vertical" form={form} className="myprofile-form">
              <div className="form-grid">
                <Form.Item label="Username" name="username">
                  <Input prefix={<UserOutlined />} disabled />
                </Form.Item>

                <Form.Item label="Role" name="role">
                  <Input prefix={<IdcardOutlined />} disabled />
                </Form.Item>

                <Form.Item label="Shift" name="shift">
                  <Input prefix={<LockOutlined />} disabled />
                </Form.Item>

                <Form.Item label="Bank Account Name" name="bankName">
                  <Input
                    prefix={<BankOutlined />}
                    placeholder="Enter your bank name"
                  />
                </Form.Item>

                <Form.Item label="Bank Account Number" name="bankNumber">
                  <Input
                    prefix={<BankOutlined />}
                    placeholder="Enter your account number"
                  />
                </Form.Item>
              </div>

              <Form.Item className="submit-btn-container">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="myprofile-save-button"
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Card>
    </div>
  );
};

export default MyProfile;
