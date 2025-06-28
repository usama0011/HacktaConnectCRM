import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Button,
  Upload,
  message,
  Spin,
} from "antd";
import { InboxOutlined, UserOutlined } from "@ant-design/icons";
import { useUserContext } from "../../context/UserContext";
import API from "../../utils/BaseURL";
import axios from "axios";
import "../../styles/SettingsAdmin.css";

const { Dragger } = Upload;

const SettingsAdmin = () => {
  const { user } = useUserContext();
  const [profileImage, setProfileImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.userImage) {
      setProfileImage(user.userImage);
    }
  }, [user]);

  const handleImageUpload = async () => {
    if (!selectedFile) {
      message.warning("Please select an image first.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const uploadRes = await axios.post(
        "https://hackta-connect-crm-client.vercel.app/api/upload",
        formData
      );

      const uploadedUrl = uploadRes.data?.url;

      if (!uploadedUrl) {
        message.error("Image upload failed.");
        return;
      }

      await API.put(`/auth/edit/${user._id}`, {
        userImage: uploadedUrl,
      });

      setProfileImage(uploadedUrl);
      setSelectedFile(null);
      message.success("Profile image updated!");
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Failed to update image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <Card className="settings-card" bordered>
        <h2>My Profile</h2>

        <div className="profile-image-section">
          <Avatar
            size={120}
            src={profileImage}
            icon={!profileImage && <UserOutlined />}
          />
        </div>

        <Dragger
          multiple={false}
          accept="image/*"
          showUploadList={false}
          beforeUpload={(file) => {
            const isImage = file.type.startsWith("image/");
            if (!isImage) {
              message.error("Only image files are allowed!");
              return Upload.LIST_IGNORE;
            }
            setSelectedFile(file);
            return false;
          }}
          className="upload-box"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag to upload a new profile picture
          </p>
        </Dragger>

        <Button
          type="primary"
          style={{ marginTop: 16 }}
          onClick={handleImageUpload}
          loading={loading}
        >
          Update Image
        </Button>
      </Card>
    </div>
  );
};

export default SettingsAdmin;
