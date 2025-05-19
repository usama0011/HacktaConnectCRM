import { useState } from "react";
import {
  Card,
  Row,
  Col,
  DatePicker,
  Button,
  Select,
  message,
  Divider,
  Table,
} from "antd";
import moment from "moment";
import API from "../../utils/BaseURL";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";

const QCPointsDownloadReports = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [qcData, setQcData] = useState([]);
  const [filters, setFilters] = useState({
    shift: "",
    agentType: "",
    branch: "",
  });

  const columns = [
    { title: "Sr No", dataIndex: "srNo", key: "srNo" },
    { title: "Agent Name", dataIndex: "name", key: "name" },
    { title: "Total Points", dataIndex: "totalPoints", key: "totalPoints" },
  ];

  const fetchData = async () => {
    if (!selectedMonth) return message.warning("Please select a month!");

    const params = {
      year: selectedMonth.year(),
      month: selectedMonth.format("MM"),
    };

    if (filters.shift) params.shift = filters.shift;
    if (filters.agentType) params.agentType = filters.agentType;
    if (filters.branch) params.branch = filters.branch;

    try {
      const res = await API.get("/qcpoints/monthly-summary", { params });

      const formatted = res.data.summary.map((item, index) => ({
        srNo: index + 1,
        name: item.name,
        avatar: item.avatar,
        totalPoints: item.totalPoints,
      }));

      setQcData(formatted);
      message.success("Monthly QC data loaded!");
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch data.");
    }
  };

  const downloadCSV = () => {
    if (!qcData.length) return message.warning("No data to export!");

    const header = ["Sr No", "Agent Name", "Total Points"];
    const rows = qcData.map((d) => [d.srNo, d.name, d.totalPoints]);

    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      `QCPoints-Summary-${selectedMonth?.format("YYYY-MM")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Download Monthly QC Points Summary</h2>
      <br />
      <Card style={{ marginBottom: 20 }}>
        <Divider orientation="left">
          <SearchOutlined /> Select Month
        </Divider>
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={6}>
            <label>Shift</label>
            <Select
              placeholder="Select Shift"
              value={filters.shift}
              onChange={(val) => setFilters({ ...filters, shift: val })}
              style={{ width: "100%" }}
              allowClear
            >
              <Select.Option value="morning">Morning</Select.Option>
              <Select.Option value="evening">Evening</Select.Option>
              <Select.Option value="night">Night</Select.Option>
            </Select>
          </Col>

          <Col xs={24} sm={6}>
            <label>Agent Type</label>
            <Select
              placeholder="Select Agent Type"
              value={filters.agentType}
              onChange={(val) => setFilters({ ...filters, agentType: val })}
              style={{ width: "100%" }}
              allowClear
            >
              <Select.Option value="Office Agent">Office Agent</Select.Option>
              <Select.Option value="WFH Agent">WFH Agent</Select.Option>
            </Select>
          </Col>

          <Col xs={24} sm={6}>
            <label>Branch</label>
            <Select
              placeholder="Select Branch"
              value={filters.branch}
              onChange={(val) => setFilters({ ...filters, branch: val })}
              style={{ width: "100%" }}
              allowClear
            >
              <Select.Option value="Branch A">Branch A</Select.Option>
              <Select.Option value="Branch B">Branch B</Select.Option>
            </Select>
          </Col>

          <Col xs={24} sm={6}>
            <label>Select Month</label>
            <DatePicker
              picker="month"
              style={{ width: "100%" }}
              placeholder="Select Month"
              onChange={(val) => setSelectedMonth(val)}
              value={selectedMonth}
              format="YYYY-MM"
            />
          </Col>
        </Row>
        <Row justify="start" gutter={16} style={{ marginTop: 10 }}>
          <Col>
            <Button type="primary" onClick={fetchData}>
              Submit
            </Button>
          </Col>
          <Col>
            <Button
              type="dashed"
              icon={<DownloadOutlined />}
              onClick={downloadCSV}
              disabled={!qcData.length}
            >
              Download CSV
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={qcData}
          rowKey="name"
          pagination={{ pageSize: 50 }}
        />
      </Card>
    </div>
  );
};

export default QCPointsDownloadReports;
