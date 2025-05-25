import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Card,
  Row,
  Col,
  Table,
  Tag,
  message,
  Spin,
  Avatar,
  Modal,
  Select,
} from "antd";
import moment from "moment";
import API from "../../utils/BaseURL";
import "../../styles/SingleUserAttandance.css";
import { Calendar } from "primereact/calendar";
import { Pie } from "@ant-design/plots";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserDeleteOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useUserContext } from "../../context/UserContext";

const { Title, Text } = Typography;
const { Option } = Select;

const SingleUserAttendance = () => {
  const { username } = useParams();
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const { user } = useUserContext();
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [userData, setUserData] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState({});
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [creatingRecord, setCreatingRecord] = useState(null);
  const [creatingStatus, setCreatingStatus] = useState("Present");

  useEffect(() => {
    fetchUserAttendance(username, selectedMonth);
  }, [username, selectedMonth]);

  const fetchUserAttendance = async (username, month) => {
    try {
      setLoading(true);
      const res = await API.get(`/attendance/user/${username}`, {
        params: { date: month.startOf("month").toISOString() },
      });
      setUserData(res.data.user);
      setStats(res.data.stats);
      setAttendanceData(res.data.attendanceData);
    } catch (error) {
      console.error("Failed to fetch user attendance:", error);
      message.error("Failed to fetch user attendance.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "📅 Date",
      dataIndex: "date",
      key: "date",
      render: (date) => <Text>{moment(date).format("YYYY-MM-DD")}</Text>,
    },
    {
      title: "🕒 Check-in Time",
      dataIndex: "checkInTime",
      key: "checkInTime",
    },
    {
      title: "🕒 Check-out Time",
      dataIndex: "checkOutTime",
      key: "checkOutTime",
    },
    {
      title: "✅ Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "Present") color = "green";
        else if (status === "Late") color = "orange";
        else if (status === "Absent") color = "red";
        else if (status === "Leave") color = "purple";
        else if (status === "RotationOff") color = "blue";

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "✏️ Action",
      key: "action",
      render: (_, record) =>
        record.checkInTime !== "-" ? (
          <a
            onClick={() => {
              setEditingRecord(record);
              setEditModalVisible(true);
            }}
          >
            Edit
          </a>
        ) : (
          <a
            style={{ color: "#1890ff" }}
            onClick={() => handleCreateAttendance(record)}
          >
            Create
          </a>
        ),
    },
  ];

  const pieChartData = stats.total
    ? [
        { type: "Present", value: stats.present },
        { type: "Absent", value: stats.absent },
        { type: "Late", value: stats.late },
        { type: "Leave", value: stats.leave },
        { type: "Rotation Off", value: stats.rotationOff },
      ]
    : [];

  const pieConfig = {
    appendPadding: 10,
    data: pieChartData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    height: window.innerWidth <= 480 ? 240 : 300,
    scale: {
      color: {
        range: [
          "#003c2f", // Dark Green (Present)
          "#005c47", // Medium-dark Green (Absent)
          "#007f5c", // Medium Green (Late)
          "#00a375", // Lighter Green (Leave)
          "#00c694", // Lightest Green (RotationOff)
        ],
      },
    },

    label: {
      text: (d) => `${d.type}: ${d.value} days`,
      position: "spider",
      style: {
        fontSize: 14,
        fontWeight: 500,
        fill: "#333",
      },
    },

    legend: {
      position: "right",
      itemSpacing: 5,
    },
    tooltip: {
      formatter: (datum) => ({
        name: datum?.type || "Unknown",
        value: `${datum?.value ?? 0} days`,
      }),
    },
    interactions: [{ type: "element-active" }],
  };
  const handleCreateAttendance = (record) => {
    setCreatingRecord(record);
    setCreatingStatus("Present");

    const now = moment(); // current datetime

    setCheckInTime(now); // ✅ Set Check-In to now
    setCheckOutTime(now); // ✅ Set Check-Out to now

    setCreateModalVisible(true);
  };

  return (
    <div className="single-user-attendance-container">
      <div className="attendance-user-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar src={userData?.avatar} size={45} />
          <h4 style={{ marginLeft: "10px" }}>{userData?.name}</h4>
        </div>
        <br />
        <br />
        <Title style={{ textAlign: "center" }} level={3}>
          Agents Attendance Report
        </Title>
        <div className="attendance-header">
          <Calendar
            value={selectedMonth.toDate()}
            onChange={(e) => setSelectedMonth(moment(e.value))}
            view="month"
            dateFormat="yy-mm"
            showIcon
            className="custom-month-picker"
          />
        </div>
      </div>
      <br />
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={attendanceData}
          rowKey="date"
          pagination={{ pageSize: 32 }}
          className="user-attendance-table"
          style={{ marginTop: 20 }}
          scroll={{ x: "max-content" }}
        />
      </Spin>
      <Row gutter={[24, 24]} style={{ marginTop: 40 }}>
        {/* Pie Chart Card */}
        <Col xs={24} md={12}>
          <Card className="cjartcardattne" title="Attendance Overview">
            {pieChartData.length > 0 ? (
              <Pie {...pieConfig} />
            ) : (
              <Spin tip="Loading Chart..." />
            )}
          </Card>
        </Col>

        {/* Attendance Summary Card */}
        <Col xs={24} md={12}>
          <Card className="summerycardattne" title="Attendance Summary">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text strong>
                  <CheckCircleOutlined
                    style={{ color: "#52c41a", marginRight: 8 }}
                  />
                  Present Days: {stats.present || 0}
                </Text>
              </Col>
              <Col span={24}>
                <Text strong>
                  <CloseCircleOutlined
                    style={{ color: "#f5222d", marginRight: 8 }}
                  />
                  Absent Days: {stats.absent || 0}
                </Text>
              </Col>
              <Col span={24}>
                <Text strong>
                  <ClockCircleOutlined
                    style={{ color: "#fa8c16", marginRight: 8 }}
                  />
                  Late Days: {stats.late || 0}
                </Text>
              </Col>
              <Col span={24}>
                <Text strong>
                  <UserDeleteOutlined
                    style={{ color: "#9254de", marginRight: 8 }}
                  />
                  Leave Days: {stats.leave || 0}
                </Text>
              </Col>
              <Col span={24}>
                <Text strong>
                  <SyncOutlined
                    style={{ color: "#1890ff", marginRight: 8 }}
                    spin
                  />
                  Rotation Off Days: {stats.rotationOff || 0}
                </Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Modal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={async () => {
          try {
            const res = await API.put("/attendance/update-status", {
              userId: editingRecord?.userId || userData?._id,
              date: editingRecord.date,
              newStatus: editingRecord.newStatus,
              updatedBy: user?.username || "Admin", // dynamic username
            });
            message.success("Attendance updated");
            fetchUserAttendance(username, selectedMonth); // Refresh data
            setEditModalVisible(false);
          } catch (err) {
            console.log(err);
            message.error("Failed to update status");
          }
        }}
        title={`Edit Attendance for ${moment(editingRecord?.date).format(
          "YYYY-MM-DD"
        )}`}
        okText="Update"
      >
        {/* Status Dropdown */}
        <Select
          value={editingRecord?.newStatus || editingRecord?.status}
          style={{ width: "100%", marginBottom: "16px" }}
          onChange={(value) =>
            setEditingRecord((prev) => ({ ...prev, newStatus: value }))
          }
        >
          <Option value="Present">Present</Option>
          <Option value="Late">Late</Option>
          <Option value="Absent">Absent</Option>
          <Option value="Leave">Leave</Option>
          <Option value="RotationOff">RotationOff</Option>
        </Select>
        {editingRecord &&
          Array.isArray(editingRecord.editHistory) &&
          editingRecord.editHistory.length > 0 && (
            <>
              <h4 style={{ marginTop: "20px" }}>Edit History</h4>
              <ul
                style={{ maxHeight: 150, overflowY: "auto", paddingLeft: 16 }}
              >
                {editingRecord.editHistory
                  .slice()
                  .reverse()
                  .map((item, index) => {
                    const statusIcon = {
                      Present: (
                        <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      ),
                      Absent: (
                        <CloseCircleOutlined style={{ color: "#f5222d" }} />
                      ),
                      Late: (
                        <ClockCircleOutlined style={{ color: "#fa8c16" }} />
                      ),
                      Leave: (
                        <UserDeleteOutlined style={{ color: "#9254de" }} />
                      ),
                      RotationOff: (
                        <SyncOutlined style={{ color: "#1890ff" }} spin />
                      ),
                    };

                    return (
                      <li key={index}>
                        <Text type="secondary">
                          Changed from{" "}
                          <Tag>
                            {statusIcon[item.previousStatus] || null}{" "}
                            {item.previousStatus}
                          </Tag>{" "}
                          by <b>{item.updatedBy}</b> on{" "}
                          {moment(item.updatedAt).format("YYYY-MM-DD HH:mm")}
                        </Text>
                      </li>
                    );
                  })}
              </ul>
            </>
          )}
      </Modal>
      <Modal
        visible={createModalVisible}
        title={`Create Attendance for ${moment(creatingRecord?.date).format(
          "YYYY-MM-DD"
        )}`}
        onCancel={() => setCreateModalVisible(false)}
        onOk={async () => {
          try {
            const res = await API.post("/attendance/admin-create", {
              userId: userData._id,
              username: userData.name,
              shift: userData.shift,
              agentType: userData.agentType,
              branch: userData.branch,
              date: creatingRecord?.date,
              status: creatingStatus,
              checkInTime: checkInTime ? checkInTime.toISOString() : null,
              checkOutTime: checkOutTime ? checkOutTime.toISOString() : null,
              updatedBy: user?.username || "Admin",
            });

            message.success(
              res.data.message || "Attendance created successfully!"
            );
            setCreateModalVisible(false);
            fetchUserAttendance(username, selectedMonth);
          } catch (error) {
            console.error("Error creating attendance:", error);
            message.error(
              error.response?.data?.message || "Failed to create attendance."
            );
          }
        }}
        okText="Create"
      >
        <>
          <Text>Select Status:</Text>
          <Select
            value={creatingStatus}
            onChange={(value) => setCreatingStatus(value)}
            style={{ width: "100%", marginBottom: 16 }}
          >
            <Option value="Present">Present</Option>
            <Option value="Late">Late</Option>
            <Option value="Absent">Absent</Option>
            <Option value="Leave">Leave</Option>
            <Option value="RotationOff">RotationOff</Option>
          </Select>
        </>
      </Modal>
    </div>
  );
};

export default SingleUserAttendance;
