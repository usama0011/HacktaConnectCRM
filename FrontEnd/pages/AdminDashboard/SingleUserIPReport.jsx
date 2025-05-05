import React, { useState, useEffect } from "react";
import {
  Table,
  Avatar,
  Typography,
  DatePicker,
  Button,
  Modal,
  Input,
  Card,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useParams, useLocation } from "react-router-dom";
import moment from "moment";
import API from "../../utils/BaseURL";
import { Column } from "@ant-design/plots"; // 📊 Chart
import "../../styles/SingleUserIPReport.css"; // new separate CSS

const { Title, Text } = Typography;

const SingleUserIPReport = () => {
  const { userId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const year = searchParams.get("year") || moment().format("YYYY");
  const month = searchParams.get("month") || moment().format("MM");

  const [userSubmissions, setUserSubmissions] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [newClicks, setNewClicks] = useState(0);
  const [newSessions, setNewSessions] = useState(0);

  const fetchUserMonthlyData = async () => {
    try {
      const res = await API.get(`/ip/monthlyips/${userId}`, {
        params: { year, month },
      });
      if (res.data) {
        setUserSubmissions(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const res = await API.get(`/users/${userId}`);
      if (res.data) {
        setUserInfo(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserMonthlyData();
    fetchUserInfo();
  }, [userId, month, year]);

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setNewClicks(record.clicks || 0);
    setNewSessions(record.sessions || 0);
    setEditModalVisible(true);
  };

  const handleSave = () => {
    setUserSubmissions((prev) =>
      prev.map((entry) =>
        entry.date === selectedRecord.date
          ? { ...entry, totalIPs: newClicks + newSessions }
          : entry
      )
    );
    setEditModalVisible(false);
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Total IPs",
      dataIndex: "totalIPs",
      key: "totalIPs",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  const chartConfig = {
    data: userSubmissions.map((item) => ({
      date: moment(item.date, "D-M-YYYY").format("DD MMM"),
      totalIPs: item.totalIPs,
    })),
    xField: "date",
    yField: "totalIPs",
    columnWidthRatio: 0.6,
    color: "#003c2f",
    label: {
      position: "middle",
      style: { fill: "#fff", fontSize: 12 },
    },
    xAxis: { label: { rotate: -45, style: { fontSize: 10 } } },
  };

  return (
    <div className="singleuserip-container">
      <Card className="singleuserip-header-card">
        <div className="header-top">
          <Avatar src={userInfo?.userImage} icon={<UserOutlined />} size={64} />
          <div>
            <Title level={3} className="user-name">
              {userInfo?.username || "Unknown User"}
            </Title>
            <div className="month-display">
              <CalendarOutlined style={{ marginRight: 6 }} />
              <Text>
                {moment(`${year}-${month}`, "YYYY-MM").format("MMMM YYYY")}
              </Text>
            </div>
          </div>
        </div>
      </Card>

      <Card className="singleuserip-chart-card">
        <Title level={4}>📊 IP Activity Chart</Title>
        <div style={{ height: 300 }}>
          <Column {...chartConfig} />
        </div>
      </Card>

      <Card className="singleuserip-table-card">
        <Title level={4}>📅 Daily IPs Report</Title>
        <Table
          columns={columns}
          dataSource={userSubmissions}
          rowKey="date"
          pagination={{ pageSize: 5 }}
          bordered
        />
      </Card>

      <Modal
        title="Edit IP Entry"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSave}
      >
        <Text strong>Date:</Text> {selectedRecord?.date}
        <br />
        <Text strong>Clicks:</Text>
        <Input
          type="number"
          value={newClicks}
          onChange={(e) => setNewClicks(Number(e.target.value))}
          placeholder="Enter clicks"
        />
        <br />
        <Text strong>Sessions:</Text>
        <Input
          type="number"
          value={newSessions}
          onChange={(e) => setNewSessions(Number(e.target.value))}
          placeholder="Enter sessions"
        />
      </Modal>
    </div>
  );
};

export default SingleUserIPReport;
