import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Avatar,
  Button,
  DatePicker,
  message,
  Row,
  Col,
  Card,
} from "antd";
import {
  UserOutlined,
  FileSearchOutlined,
  FundOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import API from "../../utils/BaseURL";
import "../../styles/QCPoints.css";

const { Title, Text } = Typography;

const AllUsersQCPoints = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(moment());
  const [topUsers, setTopUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    shift: "",
    agentType: "",
    branch: "",
  });

  // Handle Date Change (Year & Month)
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const fetchMonthlyQC = async (dateValue = selectedDate) => {
    try {
      setLoading(true);
      const year = dateValue.format("YYYY");
      const month = dateValue.format("MM");

      const res = await API.get("/qcpoints/monthly-summary", {
        params: {
          year,
          month,
          shift: filters.shift || undefined,
          agentType: filters.agentType || undefined,
          branch: filters.branch || undefined,
        },
      });

      setUsers(res.data.summary);
      setTopUsers(res.data.top5);
    } catch (err) {
      console.error("Failed to fetch monthly QC data", err);
      message.error("Failed to load QC Points");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: (
        <>
          <UserOutlined style={{ marginRight: 6 }} />
          User
        </>
      ),
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="user-info">
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <Text className="user-name">{text}</Text>
        </div>
      ),
    },
    {
      title: (
        <>
          <FundOutlined style={{ marginRight: 6 }} />
          Total QC Points
        </>
      ),
      dataIndex: "totalPoints",
      key: "totalPoints",
      render: (points) => <Text strong>{points}</Text>,
    },
    {
      title: (
        <>
          <FileSearchOutlined style={{ marginRight: 6 }} />
          View QC Points
        </>
      ),
      key: "actions",
      render: (_, record) => {
        console.log(record);
        return (
          <Button
            type="primary"
            style={{ color: "white", backgroundColor: "#003c2f" }}
            onClick={() =>
              navigate(
                `/admin/dashboard/qcpoints/user/${
                  record.name
                }?date=${selectedDate.format("YYYY-MM")}`
              )
            }
          >
            View Details
          </Button>
        );
      },
    },
  ];
  useEffect(() => {
    fetchMonthlyQC(selectedDate);
  }, []);

  return (
    <div className="qcpoints-container">
      <div className="date-filter">
        <Text style={{ marginRight: "10px", color: "black" }}>
          Select Year & Month:
        </Text>
        <input
          type="month"
          className="simple-calendar"
          value={selectedDate.format("YYYY-MM")}
          onChange={(e) => handleDateChange(moment(e.target.value))}
        />
      </div>
      <br />
      <div
        className="filter-row"
        style={{
          marginTop: 16,
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "flex-end",
        }}
      >
        <div>
          <label>Shift</label>
          <select
            value={filters.shift}
            onChange={(e) => setFilters({ ...filters, shift: e.target.value })}
            style={{ width: 180, padding: 6, borderRadius: 4 }}
          >
            <option value="">All</option>
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
            <option value="night">Night</option>
          </select>
        </div>

        <div>
          <label>Agent Type</label>
          <select
            value={filters.agentType}
            onChange={(e) =>
              setFilters({ ...filters, agentType: e.target.value })
            }
            style={{ width: 180, padding: 6, borderRadius: 4 }}
          >
            <option value="">All</option>
            <option value="Office Agent">Office Agent</option>
            <option value="WFH Agent">WFH Agent</option>
          </select>
        </div>

        <div>
          <label>Branch</label>
          <select
            value={filters.branch}
            onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
            style={{ width: 180, padding: 6, borderRadius: 4 }}
          >
            <option value="">All</option>
            <option value="Branch A">Branch A</option>
            <option value="Branch B">Branch B</option>
            <option value="Branch C">Branch C</option>
          </select>
        </div>

        <div>
          <Button
            type="primary"
            onClick={() => fetchMonthlyQC(selectedDate)}
            style={{ height: 36 }}
          >
            Apply Filters
          </Button>
        </div>
      </div>
      <br />
      {topUsers.length > 0 && (
        <>
          <Title style={{ color: "black" }} level={3}>
            🏆 Top 5 Performers of the Month
          </Title>
          <div className="top-performer-grid">
            {topUsers.map((user, index) => (
              <div className="performer-card-wrapper" key={index}>
                <Card className="top-performer-grid-card" bordered hoverable>
                  <div className="performer-card-inner">
                    <Avatar
                      size={64}
                      src={user.avatar}
                      icon={<UserOutlined />}
                      className="performer-avatar"
                    />
                    <Title level={5} className="performer-name">
                      {user.name}
                    </Title>
                    <Text type="secondary">QC Points: {user.totalPoints}</Text>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          <br />
        </>
      )}
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 50 }}
        bordered
        className="qupointsAddTable"
      />
    </div>
  );
};

export default AllUsersQCPoints;
