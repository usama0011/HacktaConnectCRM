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
import { Column } from "@ant-design/plots";
import "../../styles/SingleUserIPReport.css";
import { Calendar } from "primereact/calendar";

const { Title, Text } = Typography;

const SingleUserIPReport = () => {
  const { userId } = useParams();

  const [loading, setLoading] = useState(false);
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [newClicks, setNewClicks] = useState(0);
  const [newSessions, setNewSessions] = useState(0);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const year = searchParams.get("year") || moment().format("YYYY");
  const month = searchParams.get("month") || moment().format("MM");
  const [selectedMonth, setSelectedMonth] = useState(`${year}-${month}`);

  const fetchUserMonthlyData = async (yr = year, mon = month) => {
    setLoading(true);
    try {
      const res = await API.get(`/ip/monthlyips/${userId}`, {
        params: { year: yr, month: mon },
      });
      if (res.data) {
        setUserSubmissions(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const [newYear, newMonth] = selectedMonth.split("-");
    fetchUserMonthlyData(newYear, newMonth);
  }, [selectedMonth]);

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

    /** Bar color */
    style: {
      fill: "#003c2f",
    },

    /** Bar labels */
    label: {
      position: "middle",
      style: {
        fill: "#ffffff",
        fontSize: 12,
        fontWeight: 500,
      },
    },

    axis: {
      x: {
        labelFill: "#003c2f",
        fontWeight: "bold",
      },
      y: {
        labelFill: "#003c2f",
        fontWeight: "bold",
      },
    },
  };

  // Extract user info from first record
  const firstRecord = userSubmissions[0];

  return (
    <div className="singleuserip-container">
      <div style={{ margin: "16px 0" }}>
        <label>
          <Text strong>Select Month: </Text>
        </label>
        <div className="attendance-header">
          <Calendar
            value={moment(selectedMonth, "YYYY-MM").toDate()}
            onChange={(e) => {
              const selected = moment(e.value).format("YYYY-MM");
              setSelectedMonth(selected);
            }}
            view="month"
            dateFormat="yy-mm"
            showIcon
            className="custom-month-picker"
          />
        </div>
      </div>

      <Card className="singleuserip-header-card">
        <div className="header-top">
          <Avatar src={firstRecord?.avatar} icon={<UserOutlined />} size={64} />
          <div>
            <Title level={3} className="user-name">
              {firstRecord?.username || "Unknown User"}
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

      <Card className="singleuserip-table-card">
        <Title level={4}>📅 Daily IPs Report</Title>
        <Table
          columns={columns}
          dataSource={userSubmissions}
          rowKey="date"
          pagination={{ pageSize: 50 }}
          bordered
          loading={loading}
          scroll={{ x: "max-content" }} // ✅ Enables horizontal scroll
        />
      </Card>

      <Card className="singleuserip-chart-card">
        <Title level={4}>📊 IP Activity Chart</Title>
        <div style={{ height: 300 }}>
          {loading ? (
            <div style={{ textAlign: "center", paddingTop: 100 }}>
              <span className="ant-spin-dot ant-spin-dot-spin" />
            </div>
          ) : (
            <Column {...chartConfig} />
          )}
        </div>
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
