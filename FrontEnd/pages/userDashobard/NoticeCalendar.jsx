import React, { useState } from "react";
import { Calendar, Badge, Card, Typography, Modal, List } from "antd";
import {
  CalendarOutlined,
  NotificationOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import "../../styles/NoticeCalendar.css";

const { Title, Text } = Typography;

const NoticeCalendar = () => {
  const [notices] = useState({
    "2024-07-10": [{ type: "warning", content: "Maintenance scheduled" }],
    "2024-07-15": [{ type: "success", content: "New feature rollout" }],
    "2024-07-20": [{ type: "error", content: "System downtime alert" }],
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotices, setSelectedNotices] = useState([]);

  const dateCellRender = (value) => {
    const dateKey = value.format("YYYY-MM-DD");
    return (
      <ul className="events" onClick={() => openModal(dateKey)}>
        {notices[dateKey]?.map((item, index) => (
          <li key={index}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const openModal = (dateKey) => {
    if (notices[dateKey]) {
      setSelectedDate(dateKey);
      setSelectedNotices(notices[dateKey]);
      setModalVisible(true);
    }
  };

  return (
    <div className="noticecalendar-container">
      <div className="noticecalendar-header">
        <Title level={2} className="noticecalendar-title">
          <CalendarOutlined style={{ marginRight: 10 }} />
          Notice & Events Calendar
        </Title>
        <Text className="noticecalendar-subtext">
          <InfoCircleOutlined style={{ marginRight: 6 }} />
          Stay updated with upcoming notices, announcements, and events.
        </Text>
      </div>

      <Card className="noticecalendar-card">
        <Calendar dateCellRender={dateCellRender} fullscreen={true} />
      </Card>

      <Modal
        title={`🗓️ Notices for ${selectedDate}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <List
          dataSource={selectedNotices}
          renderItem={(item) => (
            <List.Item>
              <Badge status={item.type} text={item.content} />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default NoticeCalendar;
