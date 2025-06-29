import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Avatar,
  Button,
  DatePicker,
  message,
  Select,
  Row,
  Col,
  Card,
  Input,
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
import { Calendar } from "primereact/calendar";
import { useUserContext } from "../../context/UserContext";
const { Option } = Select;

const { Title, Text } = Typography;

const AllUsersQCPoints = () => {
  const navigate = useNavigate();
  const {user} = useUserContext()
  const [selectedDate, setSelectedDate] = useState(moment());
  const [topUsers, setTopUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    shift: "",
    agentType: "",
    branch: "",
    agentName: "",
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
          agentName: filters.agentName || undefined,
        },
      });

      setUsers(res.data.summary);
      setTopUsers(res.data.top3); // ✅ changed from res.data.top5
    } catch (err) {
      console.error("Failed to fetch monthly QC data", err);
      if (err.response && err.response.status === 404) {
        message.error(
          err.response.data.message || "No data found for the selected filters."
        );
      } else {
        message.error("Failed to load QC Points");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
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
            style={{ color: "white", backgroundColor: "#1e2d7d" }}
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
        <div  style={{margin:0,padding:0}} className="attendance-header">
          <Calendar  style={{margin:0,padding:0}}
            value={selectedDate.toDate()}
            onChange={(e) => handleDateChange(moment(e.value))}
            view="month"
            dateFormat="yy-mm"
            showIcon
            className="custom-month-picker"
          />
        </div>
      </div>
      <br />
    <div
  style={{ marginTop: 16, display: "flex", gap: 16, flexWrap: "wrap" }}
>
  {/* Show Shift filter only for privileged roles */}
  {["Super Admin", "HR", "Floor Manager", "Assistant Floor Manager"].includes(user?.role) && (
    <Select
      placeholder="Please select Shift"
      value={filters.shift || undefined}
      style={{ width: 180 }}
      onChange={(value) => handleFilterChange("shift", value)}
      allowClear
    >
      <Option disabled value="">
        Please select Shift
      </Option>
      <Option value="morning">Morning</Option>
      <Option value="evening">Evening</Option>
      <Option value="night">Night</Option>
    </Select>
  )}

  {/* Always show Agent Type filter */}
  <Select
    placeholder="Please select Agent Type"
    value={filters.agentType || undefined}
    style={{ width: 180 }}
    onChange={(value) => handleFilterChange("agentType", value)}
    allowClear
  >
    <Option disabled value="">
      Please select Agent Type
    </Option>
    <Option value="Office Agent">Office Agent</Option>
    <Option value="WFH Agent">WFH Agent</Option>
  </Select>

  {/* Show Branch filter only for privileged roles */}
  {["Super Admin", "HR", "Floor Manager", "Assistant Floor Manager"].includes(user?.role) && (
    <Select
      placeholder="Please select Branch"
      value={filters.branch || undefined}
      style={{ width: 180 }}
      onChange={(value) => handleFilterChange("branch", value)}
      allowClear
    >
      <Option disabled value="">
        Please select Branch
      </Option>
      <Option value="Branch A">Branch A</Option>
      <Option value="Branch B">Branch B</Option>
    </Select>
  )}

  {/* Always show Username filter */}
  <Input
    placeholder="Search by Agent Name"
    value={filters.agentName}
    onChange={(e) => handleFilterChange("agentName", e.target.value)}
    style={{ width: 200, borderRadius: "10px" }}
    allowClear
  />

  {/* Apply Filters Button */}
  <Button type="primary" onClick={() => fetchMonthlyQC(selectedDate)}>
    Apply Filters
  </Button>
  <Button
  onClick={() => {
    setFilters({
      shift: "",
      agentType: "",
      branch: "",
      agentName: "",
    });
 
    fetchMonthlyQC(selectedDate, 1, 50);
  }}
>
  Reset Filters
</Button>

</div>

      <br />
      <br />

      {topUsers.length > 0 && (
        <>
          <Title
            className="allqctopfiveperformat"
            style={{ color: "black" }}
            level={3}
          >
            🏆 Top 3 Performers of the Month
          </Title>
          <div className="top-performer-grid">
            {topUsers.map((user, index) => (
              <div className="performer-card-wrapper" key={index}>
                <Card
                  className="top-performer-grid-card"
                  bordered={false}
                  hoverable
                >
                  {/* Top Decoration */}
                  <div className="performer-card-top-curve" />

                  <div className="performer-card-inner">
                    <Avatar
                      src={user.avatar}
                      icon={<UserOutlined />}
                      className="performer-avatar"
                    />
                    <div className="maindivparentsideperfom">
                      <Title level={5} className="performer-name">
                        {user.name}
                      </Title>
                      <p className="qcpintnumber">
                        QC Points: {user.totalPoints}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Decoration */}
                  <div className="performer-card-bottom-curve" />
                </Card>
              </div>
            ))}
          </div>

          <br />
        </>
      )}
      <br />
      <br />
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey={(record) => record.name}
                    pagination={{
  defaultPageSize: 50,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50", "100"],
}}
        bordered
        className="qupointsAddTable"
        scroll={{ x: "max-content" }} // ✅ Enables horizontal scroll
      />
    </div>
  );
};

export default AllUsersQCPoints;
