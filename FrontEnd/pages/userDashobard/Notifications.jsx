import React, { useState } from "react";
import { Card, List, Badge, Typography, Button } from "antd";
import { NotificationOutlined, CheckCircleOutlined } from "@ant-design/icons";
import "../../styles/Notifications.css";

const { Title, Text } = Typography;

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New Announcement: System Update!",
      type: "warning",
      read: false,
    },
    {
      id: 2,
      message: "Your account settings were updated",
      type: "success",
      read: true,
    },
    {
      id: 3,
      message: "Security Alert: Unusual login attempt",
      type: "error",
      read: false,
    },
    {
      id: 4,
      message: "Reminder: Complete your profile",
      type: "info",
      read: true,
    },
  ]);

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="notifications-container">
      <Title level={2} className="notifications-title">
        Notifications <NotificationOutlined />
      </Title>
      <Text className="notifications-subtext">
        Stay updated with the latest alerts and announcements.
      </Text>

      <Card className="notifications-card">
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              className={`notification-item ${item.read ? "read" : "unread"}`}
            >
              <List.Item.Meta
                avatar={<Badge status={item.type} />}
                title={<Text>{item.message}</Text>}
              />
              {!item.read && <Badge color="red" text="New" />}
            </List.Item>
          )}
        />
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          className="mark-all-button"
          onClick={markAllAsRead}
        >
          Mark All as Read
        </Button>
      </Card>
    </div>
  );
};

export default Notifications;
