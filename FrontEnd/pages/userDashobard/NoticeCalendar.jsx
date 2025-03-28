import React, { useState } from "react";
import { Calendar, Badge, Card, Typography, Modal, List } from "antd";
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

  // Renders notices inside each date cell
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

  // Opens the modal with the selected date's notices
  const openModal = (dateKey) => {
    if (notices[dateKey]) {
      setSelectedDate(dateKey);
      setSelectedNotices(notices[dateKey]);
      setModalVisible(true);
    }
  };

  return (
    <div className="noticecalendar-container">
      <Title level={2} className="noticecalendar-title">
        Notice & Events Calendar
      </Title>
      <Text className="noticecalendar-subtext">
        Stay updated with upcoming notices, announcements, and events.
      </Text>

      <Card className="noticecalendar-card">
        <Calendar dateCellRender={dateCellRender} />
      </Card>

      {/* Modal for Notice Details */}
      <Modal
        title={`Notices for ${selectedDate}`}
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
