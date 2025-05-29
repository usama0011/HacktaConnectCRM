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
  InboxOutlined,
} from "@ant-design/icons";
import "../../styles/MyProfile.css";
import { useUserContext } from "../../context/UserContext";
import API from "../../utils/BaseURL";
import axios from "axios";
const { Dragger } = Upload;

const { Title, Text } = Typography;

const MyProfile = () => {
  const [form] = Form.useForm();
  const { user, token } = useUserContext();
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await API.get(`/auth/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
                accept="image/*"
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith("image/");
                  if (!isImage) {
                    message.error("Only image files are allowed!");
                    return Upload.LIST_IGNORE;
                  }

                  const previewUrl = URL.createObjectURL(file);
                  setProfileImage(previewUrl); // Show preview
                  setSelectedFile(file); // Store for upload
                  return false;
                }}
              >
                <Dragger
                  name="file"
                  multiple={false}
                  showUploadList={false}
                  accept="image/*"
                  beforeUpload={(file) => {
                    const isImage = file.type.startsWith("image/");
                    if (!isImage) {
                      message.error("Only image files are allowed!");
                      return Upload.LIST_IGNORE;
                    }

                    const previewUrl = URL.createObjectURL(file);
                    setProfileImage(previewUrl); // Show preview
                    setSelectedFile(file); // Store for backend upload
                    return false;
                  }}
                  style={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 20,
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area
                  </p>
                </Dragger>
              </Upload>
            </div>

            <Form
              layout="vertical"
              form={form}
              className="myprofile-form"
              onFinish={async (values) => {
                setLoading(true);

                try {
                  let uploadedUrl = profileImage;

                  if (selectedFile) {
                    const formData = new FormData();
                    formData.append("image", selectedFile);
                    const uploadRes = await axios.post(
                      "https://hackta-connect-crm-client.vercel.app/api/upload",
                      formData
                    );

                    console.log("Upload Response:", uploadRes.data); // Debug line

                    uploadedUrl = uploadRes.data.url;

                    if (!uploadedUrl) {
                      message.error("Image upload failed.");
                      setLoading(false);
                      return;
                    }
                  }

                  // 2. Send updated info to backend
                  const updateRes = await API.put(
                    `/auth/edit/${user._id}`,
                    {
                      bankName: values.bankName,
                      bankNumber: values.bankNumber,
                      userImage: uploadedUrl,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  if (updateRes.status === 200) {
                    message.success("Profile updated successfully!");
                  } else {
                    message.error("Failed to update profile.");
                  }
                } catch (error) {
                  console.error(error);
                  message.error("An error occurred while updating profile.");
                } finally {
                  setLoading(false);
                }
              }}
            >
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
                <Button type="primary" htmlType="submit" loading={loading}>
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
