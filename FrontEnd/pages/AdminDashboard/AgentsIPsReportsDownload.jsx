import { useState } from "react";
import {
  Card,
  Row,
  Col,
  DatePicker,
  Button,
  message,
  Divider,
  Table,
  Select,
} from "antd";
import moment from "moment";
import API from "../../utils/BaseURL";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

const AgentsIPsReportsDownload = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [ipData, setIpData] = useState([]);
  const [filters, setFilters] = useState({
    shift: "",
    agentType: "",
    branch: "", // ✅ added
  });

  const columns = [
    { title: "Sr No", dataIndex: "srNo", key: "srNo" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Shift", dataIndex: "shift", key: "shift" },
    { title: "Branch", dataIndex: "branch", key: "branch" }, // ✅ Add this
    { title: "Agent Type", dataIndex: "agentType", key: "agentType" },
    { title: "Total Clicks", dataIndex: "totalClicks", key: "totalClicks" },
    {
      title: "Total Sessions",
      dataIndex: "totalSessions",
      key: "totalSessions",
    },
    { title: "Total IPs", dataIndex: "totalIPs", key: "totalIPs" },
  ];

  const fetchData = async () => {
    if (!selectedMonth) {
      return message.warning("Please select a month first.");
    }

    try {
      const year = selectedMonth.year();
      const month = selectedMonth.format("MM");
      const res = await API.get("/ip/myagentsagents/monthly", {
        params: { year, month },
      });

      const formatted = res.data.agents.map((agent, index) => ({
        srNo: index + 1,
        ...agent,
      }));

      setIpData(formatted);
      message.success("Data fetched successfully!");
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch data.");
    }
  };

  const downloadCSV = () => {
    if (!ipData.length) {
      return message.warning("No data to download.");
    }

    const filtered = ipData.filter((agent) => {
      const shiftMatch = filters.shift ? agent.shift === filters.shift : true;
      const typeMatch = filters.agentType
        ? agent.agentType === filters.agentType
        : true;
      const branchMatch = filters.branch
        ? agent.branch === filters.branch
        : true; // ✅ added
      return shiftMatch && typeMatch && branchMatch;
    });

    const headers = [
      "Sr No",
      "Username",
      "Shift",
        "Branch", // ✅ added

      "Agent Type",
      "Total Clicks",
      "Total Sessions",
      "Total IPs",
    ];

    const rows = filtered.map((agent) => [
      agent.srNo,
      agent.username,
      agent.shift,
      agent.agentType,
        agent.branch || "N/A", // ✅ added
      agent.totalClicks,
      agent.totalSessions,
      agent.totalIPs,
    ]);

    const csvContent =
      headers.join(",") +
      "\n" +
      rows.map((row) => row.map(String).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `AgentsMonthlyIPReport-${selectedMonth.format("YYYY-MM")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Download Agents Monthly IP Report</h2>
      <br />
      <Card style={{ marginBottom: 20 }}>
        <Divider orientation="left">
          <SearchOutlined /> Filters & Download
        </Divider>
        <Row gutter={[16, 16]}>
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
          <Col xs={24} sm={6}>
            <label>Shift (for download only)</label>
            <Select
              placeholder="Select Shift"
              style={{ width: "100%" }}
              allowClear
              value={filters.shift}
              onChange={(val) => setFilters({ ...filters, shift: val })}
            >
              <Option value="morning">Morning</Option>
              <Option value="evening">Evening</Option>
              <Option value="night">Night</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <label>Agent Type (for download only)</label>
            <Select
              placeholder="Select Agent Type"
              style={{ width: "100%" }}
              allowClear
              value={filters.agentType}
              onChange={(val) => setFilters({ ...filters, agentType: val })}
            >
              <Option value="Office Agent">Office Agent</Option>
              <Option value="WFH Agent">WFH Agent</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <label>Branch (for download only)</label>
            <Select
              placeholder="Select Branch"
              style={{ width: "100%" }}
              allowClear
              value={filters.branch}
              onChange={(val) => setFilters({ ...filters, branch: val })}
            >
              <Option value="Branch A">Branch A</Option>
              <Option value="Branch B">Branch B</Option>
              {/* Add more branches as needed */}
            </Select>
          </Col>

          <Col xs={24} sm={6} style={{ display: "flex", alignItems: "end" }}>
            <Button type="primary" onClick={fetchData}>
              Submit
            </Button>
            <Button
              type="dashed"
              icon={<DownloadOutlined />}
              style={{ marginLeft: 10 }}
              onClick={downloadCSV}
              disabled={!ipData.length}
            >
              Download
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={ipData}
          rowKey="id"
          className="custom-attendance-table"
          scroll={{ x: "max-content" }} // ✅ Enables horizontal scroll
          pagination={{ pageSize: 50 }}
        />
      </Card>
    </div>
  );
};

export default AgentsIPsReportsDownload;
