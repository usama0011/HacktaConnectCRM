import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  DatePicker,
  Select,
  message,
  Divider,
} from "antd";
import moment from "moment";
import API from "../../utils/BaseURL";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

const AttandanceDownloadReports = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [filters, setFilters] = useState({
    shift: "",
    agentType: "",
  });

  const columns = [
    { title: "Sr No", dataIndex: "srNo", key: "srNo" },
    { title: "Agent Name", dataIndex: "name", key: "name" },
    { title: "Shift", dataIndex: "shift", key: "shift" },
    { title: "Agent Type", dataIndex: "agentType", key: "agentType" },
    { title: "Present", dataIndex: "present", key: "present" },
    { title: "Absent", dataIndex: "absent", key: "absent" },
    { title: "Late", dataIndex: "late", key: "late" },
    { title: "Leave", dataIndex: "leave", key: "leave" },
    { title: "Rotation Off", dataIndex: "rotationOff", key: "rotationOff" },
    { title: "Total Days", dataIndex: "totalDays", key: "totalDays" },
    {
      title: "Attendance %",
      dataIndex: "attendanceRate",
      key: "attendanceRate",
      render: (val) => `${val}%`,
    },
  ];

  const fetchAttendance = async () => {
    if (!selectedMonth) return message.warning("Please select a month!");

    try {
      const res = await API.get("/attendance/all", {
        params: { date: selectedMonth.format("YYYY-MM") },
      });

      const formatted = res.data.attendanceData.map((entry, idx) => {
        const summary = entry.monthSummary;
        const totalDays =
          summary.present +
          summary.absent +
          summary.late +
          summary.leave +
          summary.rotationOff;

        return {
          srNo: idx + 1,
          name: entry.user.name,
          shift: entry.shift,
          agentType: entry.agentType,
          present: summary.present,
          absent: summary.absent,
          late: summary.late,
          leave: summary.leave,
          rotationOff: summary.rotationOff,
          totalDays,
          attendanceRate: totalDays
            ? ((summary.present / totalDays) * 100).toFixed(2)
            : "0.00",
        };
      });

      setAttendanceData(formatted);
      message.success("Attendance fetched!");
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch data.");
    }
  };

  const downloadCSV = () => {
    if (!attendanceData.length) return message.warning("No data to export!");

    // Apply frontend filters
    const filtered = attendanceData.filter((item) => {
      const shiftMatch = filters.shift ? item.shift === filters.shift : true;
      const typeMatch = filters.agentType ? item.agentType === filters.agentType : true;
      return shiftMatch && typeMatch;
    });

    if (!filtered.length) {
      return message.warning("No matching records to download.");
    }

    const headers = [
      "Sr No",
      "Agent Name",
      "Shift",
      "Agent Type",
      "Present",
      "Absent",
      "Late",
      "Leave",
      "Rotation Off",
      "Total Days",
      "Attendance %",
    ];

    const rows = filtered.map((d) => [
      d.srNo,
      d.name,
      d.shift,
      d.agentType,
      d.present,
      d.absent,
      d.late,
      d.leave,
      d.rotationOff,
      d.totalDays,
      `${d.attendanceRate}%`,
    ]);

    const csvContent =
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      `Filtered-Attendance-${selectedMonth?.format("YYYY-MM")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Download Monthly Attendance Report</h2>
      <br />
      <Card style={{ marginBottom: 20 }}>
        <Divider orientation="left">
          <SearchOutlined /> Filters
        </Divider>
        <Row gutter={16}>
          <Col xs={24} sm={6}>
            <label>Month</label>
            <DatePicker
              picker="month"
              style={{ width: "100%" }}
              placeholder="Select Month"
              onChange={(date) => setSelectedMonth(date)}
              value={selectedMonth}
              format="YYYY-MM"
            />
          </Col>
          <Col xs={24} sm={6}>
            <label>Shift</label>
            <Select
              placeholder="All Shifts"
              value={filters.shift}
              onChange={(val) => setFilters({ ...filters, shift: val })}
              allowClear
              style={{ width: "100%" }}
            >
              <Option value="morning">Morning</Option>
              <Option value="evening">Evening</Option>
              <Option value="night">Night</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <label>Agent Type</label>
            <Select
              placeholder="All Types"
              value={filters.agentType}
              onChange={(val) => setFilters({ ...filters, agentType: val })}
              allowClear
              style={{ width: "100%" }}
            >
              <Option value="Office Agent">Office Agent</Option>
              <Option value="WFH Agent">WFH Agent</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6} style={{ display: "flex", alignItems: "end" }}>
            <Button type="primary" onClick={fetchAttendance}>
              Submit
            </Button>
            <Button
              type="dashed"
              icon={<DownloadOutlined />}
              style={{ marginLeft: 10 }}
              onClick={downloadCSV}
              disabled={!attendanceData.length}
            >
              Download CSV
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          dataSource={attendanceData}
          columns={columns}
          rowKey="srNo"
          pagination={{ pageSize: 50 }}
        />
      </Card>
    </div>
  );
};

export default AttandanceDownloadReports;
