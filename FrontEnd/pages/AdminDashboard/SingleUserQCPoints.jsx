import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Avatar,
  DatePicker,
  message,
  Modal,
  Input,
  Button,
  Skeleton,
  Card,
} from "antd";

import {
  CalendarOutlined,
  ClockCircleOutlined,
  ProfileOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  SmileOutlined,
  StarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useParams, useLocation } from "react-router-dom";
import { Bar } from "@ant-design/plots";
import moment from "moment";
import axios from "axios";
import "../../styles/QCPoints.css";
import { Calendar } from "primereact/calendar";
import API from "../../utils/BaseURL";
import { useUserContext } from "../../context/UserContext";

const { Title, Text } = Typography;

const SingleUserQCPoints = () => {
  const { userId } = useParams();
  const { user } = useUserContext();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formValues, setFormValues] = useState({});

  const query = new URLSearchParams(location.search);
  const dateParam = query.get("date");

  const [selectedDate, setSelectedDate] = useState(
    dateParam ? moment(dateParam, "YYYY-MM") : moment()
  );
  const [userData, setUserData] = useState({
    name: "",
    avatar: "",
    points: [],
  });

  const fetchUserQC = async () => {
    setLoading(true); // Start loading
    try {
      const year = selectedDate.format("YYYY");
      const month = selectedDate.format("MM");
      const res = await API.get(
        `/qcpoints/user/${userId}?year=${year}&month=${month}`
      );
      setUserData(res.data);
    } catch (err) {
      console.error("Failed to fetch user QC points", err);
      message.error("Error loading user QC data.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchUserQC();
  }, [selectedDate]);
  const handleEdit = (record) => {
    setSelectedRecord(record);
    setFormValues({
      time: record.time || "",
      profilePattern: record.profilePattern || "",
      pacePerHour: record.pacePerHour || "",
      perHourReport: record.perHourReport || "",
      workingBehavior: record.workingBehavior || "",
    });
    setEditModalVisible(true);
  };

  const columns = [
    {
      title: (
        <>
          <CalendarOutlined /> Date
        </>
      ),
      dataIndex: "date",
      key: "date",
    },
    {
      title: (
        <>
          <ClockCircleOutlined /> Time
        </>
      ),
      dataIndex: "time",
      key: "time",
    },
    {
      title: (
        <>
          <ProfileOutlined /> Profile Pattern
        </>
      ),
      dataIndex: "profilePattern",
      key: "profilePattern",
    },
    {
      title: (
        <>
          <ThunderboltOutlined /> Pace Per Hour
        </>
      ),
      dataIndex: "pacePerHour",
      key: "pacePerHour",
    },
    {
      title: (
        <>
          <BarChartOutlined /> Per Hour Report
        </>
      ),
      dataIndex: "perHourReport",
      key: "perHourReport",
    },
    {
      title: (
        <>
          <SmileOutlined /> Working Behavior
        </>
      ),
      dataIndex: "workingBehavior",
      key: "workingBehavior",
    },
    {
      title: (
        <>
          <StarOutlined /> Total Points
        </>
      ),
      dataIndex: "totalPoints",
      key: "totalPoints",
      render: (points) => <Text strong>{points}</Text>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];
  const handleSave = async () => {
    try {
      await API.put(
        `/qcpoints/update/${selectedRecord.name}/${selectedRecord._id}`,
        {
          values: formValues,
          editor: user?.agentName, // Replace with real user
        }
      );
      message.success("QC Points updated!");
      setEditModalVisible(false);
      fetchUserQC(); // Refresh
    } catch (err) {
      console.error(err);
      message.error("Failed to update QC points");
    }
  };
  const totals = userData.points.reduce(
    (acc, row) => {
      acc.time += Number(row.time || 0);
      acc.profilePattern += Number(row.profilePattern || 0);
      acc.pacePerHour += Number(row.pacePerHour || 0);
      acc.perHourReport += Number(row.perHourReport || 0);
      acc.workingBehavior += Number(row.workingBehavior || 0);
      return acc;
    },
    {
      time: 0,
      profilePattern: 0,
      pacePerHour: 0,
      perHourReport: 0,
      workingBehavior: 0,
    }
  );

  const barChartData = [
    { category: "Time", value: totals.time },
    { category: "Profile Pattern", value: totals.profilePattern },
    { category: "Pace Per Hour", value: totals.pacePerHour },
    { category: "Per Hour Report", value: totals.perHourReport },
    { category: "Working Behavior", value: totals.workingBehavior },
  ];

  return (
    <div className="qcpoints-container">
      <Title level={2} className="qcpoints-title">
        User QC Points Breakdown
      </Title>
      <Skeleton loading={loading} avatar active paragraph={{ rows: 1 }}>
        <div className="headtopsidbarskjs">
          <Avatar src={userData.avatar} size={64} icon={<UserOutlined />} />
          <div style={{ marginLeft: "10px" }}>
            <h3 style={{ paddingBottom: "4px" }}>{userData.name}</h3>
            <span>{selectedDate.format("MMMM YYYY")}</span>
          </div>
        </div>
      </Skeleton>

      <br />
      <div className="attendance-header">
        <Calendar
          value={selectedDate.toDate()}
          onChange={(e) => setSelectedDate(moment(e.value))}
          view="month"
          dateFormat="yy-mm"
          showIcon
          className="custom-month-picker"
        />
      </div>

      <br />
      <br />
      <Skeleton loading={loading} active avatar paragraph={{ rows: 4 }}>
        <br />
        <Table
          className="qupointsAddTable"
          columns={columns}
          dataSource={userData.points}
          rowKey="date"
          scroll={{ x: "max-content" }}
          pagination={{ pageSize: 5 }}
          bordered
          summary={() => {
            const totals = {
              time: 0,
              profilePattern: 0,
              pacePerHour: 0,
              perHourReport: 0,
              workingBehavior: 0,
              totalPoints: 0,
            };

            userData.points.forEach((row) => {
              totals.time += Number(row.time || 0);
              totals.profilePattern += Number(row.profilePattern || 0);
              totals.pacePerHour += Number(row.pacePerHour || 0);
              totals.perHourReport += Number(row.perHourReport || 0);
              totals.workingBehavior += Number(row.workingBehavior || 0);
              totals.totalPoints += Number(row.totalPoints || 0);
            });

            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>
                  <Text strong>Total</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text strong>{totals.time}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <Text strong>{totals.profilePattern}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <Text strong>{totals.pacePerHour}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  <Text strong>{totals.perHourReport}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  <Text strong>{totals.workingBehavior}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                  <Text strong>{totals.totalPoints}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7}></Table.Summary.Cell>{" "}
                {/* Empty for Actions column */}
              </Table.Summary.Row>
            );
          }}
        />
      </Skeleton>
      <br />
      <Title level={4}>QC Points Distribution Chart</Title>
      <Card>
        <Bar
          data={barChartData}
          xField="value" // Total points
          yField="category" // Field name
          seriesField="category"
          colorField="category"
          legend={false}
          xAxis={{
            min: 0,
            max: 31,
            title: {
              text: "Total Points",
              style: { fontWeight: 600 },
            },
          }}
          yAxis={{
            title: {
              text: "Categories",
              style: { fontWeight: 600 },
            },
          }}
          label={{
            position: "right", // move label to end of the bar
            style: {
              fill: "#000", // black
              fontWeight: "bold",
            },
          }}
          barStyle={{
            fillOpacity: 1,
            radius: [4, 4, 4, 4],
          }}
          tooltip={{
            formatter: (datum) => ({
              name: datum.category,
              value: datum.value,
            }),
          }}
        />
      </Card>

      <Modal
        title="Edit QC Entry"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSave}
      >
        {[
          "time",
          "profilePattern",
          "pacePerHour",
          "perHourReport",
          "workingBehavior",
        ].map((field) => (
          <div key={field} style={{ marginBottom: "12px" }}>
            <Text strong>{field}</Text>
            <Input
              value={formValues[field]}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, [field]: e.target.value }))
              }
            />
          </div>
        ))}

        <br />
        <Title level={5}>Edit History</Title>
        {selectedRecord?.history?.length > 0 ? (
          <Table
            dataSource={selectedRecord.history}
            columns={[
              { title: "Action", dataIndex: "action" },
              { title: "Editor", dataIndex: "by" },
              { title: "Timestamp", dataIndex: "timestamp" },
            ]}
            rowKey={(item) => item.timestamp + item.by}
            size="small"
            pagination={false}
          />
        ) : (
          <Text>No history available.</Text>
        )}
      </Modal>
    </div>
  );
};

export default SingleUserQCPoints;
