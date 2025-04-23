// src/components/DateTimeDisplay.jsx
import React, { useState, useEffect } from "react";
import { ClockCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import "../styles/DateTimeDisplay.css";
import dayjs from "dayjs";

const DateTimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="datetime-widget">
      <div className="datetime-block">
        <CalendarOutlined className="datetime-icon" />
        <span className="datetime-text">
          {currentTime.format("dddd, MMMM D, YYYY")}
        </span>
      </div>
      <div className="datetime-block">
        <ClockCircleOutlined className="datetime-icon" />
        <span className="datetime-text">
          {currentTime.format("hh:mm:ss A")}
        </span>
      </div>
    </div>
  );
};

export default DateTimeDisplay;
