import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Row,
  Col,
  Select,
  DatePicker,
  Button,
  message,
  Divider,
} from "antd";
import HeaderImage from "../../src/assets/headerImage.png";
import MainLogo from "../../src/assets/mainlogo.png";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import API from "../../utils/BaseURL";
import FooterImage from "../../src/assets/footerImage.png";
import {
  UserOutlined,
  BankOutlined,
  IdcardOutlined,
  BranchesOutlined,
  FieldNumberOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import "../../styles/RegisteredUsersDownloadReports.css";

const { Option } = Select;

const RegisteredUsersDownloadReports = () => {
  const [agents, setAgents] = useState([]);
  const [filters, setFilters] = useState({
    shift: "",
    agentType: "",
    branch: "",
    bankaccountstatus: "",
  });

  const fetchAgents = async () => {
    try {
      const { shift, agentType, branch, bankaccountstatus } = filters;

      const res = await API.get("auth/agents", {
        params: {
          shift,
          agentType,
          branch,
          bankaccountstatus:
            bankaccountstatus === "Has Account"
              ? true
              : bankaccountstatus === "No Account"
              ? false
              : undefined,
        },
      });

      setAgents(
        res.data.map((agent, index) => ({
          ...agent,
          srNo: index + 1,
        }))
      );
      message.success("Agents loaded successfully!");
    } catch (error) {
      message.error("Failed to fetch agents.");
      console.error(error);
    }
  };

  const handleDownload = () => {
    if (!agents.length) {
      message.warning("No data available to download.");
      return;
    }

    const header = [
      "Sr No",
      "Agent Name",
      "Shift",
      "Agent Type",
      "CNIC",
      "Branch",
      "Has Bank Account",
      "Joining Date",
    ];

    const rows = agents.map((agent, index) => [
      index + 1,
      agent.agentName,
      agent.shift,
      agent.agentType,
      agent.cnic,
      agent.branch,
      agent.bankaccountstatus ? "Yes" : "No",
      moment(agent.joiningDate).format("YYYY-MM-DD"),
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((item) => `"${item}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `RegisteredAgents-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    { title: "Sr No", dataIndex: "srNo", key: "srNo" },
    {
      title: (
        <span>
          <TeamOutlined /> Agent Name
        </span>
      ),
      dataIndex: "agentName",
      key: "agentName",
    },
    {
      title: (
        <span>
          <FieldNumberOutlined /> Shift
        </span>
      ),
      dataIndex: "shift",
      key: "shift",
    },
    {
      title: "Agent Type",
      dataIndex: "agentType",
      key: "agentType",
    },
    {
      title: (
        <span>
          <IdcardOutlined /> CNIC
        </span>
      ),
      dataIndex: "cnic",
      key: "cnic",
    },
    {
      title: (
        <span>
          <BranchesOutlined /> Branch
        </span>
      ),
      dataIndex: "branch",
      key: "branch",
    },
    {
      title: "Has Bank Account",
      dataIndex: "bankaccountstatus",
      key: "bankaccountstatus",
      render: (val) => (val ? "Yes" : "No"),
    },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
      key: "joiningDate",
      render: (val) => moment(val).format("YYYY-MM-DD"),
    },
  ];

  return (
    <div className="registered-users-container">
      <h2>Download Registered Agents</h2>
      <br />
      <Card className="registered-users-card">
        <Divider orientation="left">
          <SearchOutlined /> Filters
        </Divider>
        <Row gutter={16}>
          <Col xs={24} sm={6}>
            <label>Shift</label>
            <Select
              value={filters.shift}
              onChange={(val) => setFilters({ ...filters, shift: val })}
              placeholder="Select Shift"
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
              value={filters.agentType}
              onChange={(val) => setFilters({ ...filters, agentType: val })}
              placeholder="Select Type"
              allowClear
              style={{ width: "100%" }}
            >
              <Option value="Office Agent">Office Agent</Option>
              <Option value="WFH Agent">WFH Agent</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <label>Branch</label>
            <Select
              value={filters.branch}
              onChange={(val) => setFilters({ ...filters, branch: val })}
              placeholder="Select Branch"
              allowClear
              style={{ width: "100%" }}
            >
              <Option value="Branch A">Branch A</Option>
              <Option value="Branch B">Branch B</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <label>Bank Account Status</label>
            <Select
              value={filters.bankaccountstatus}
              onChange={(val) =>
                setFilters({ ...filters, bankaccountstatus: val })
              }
              placeholder="Bank Account"
              allowClear
              style={{ width: "100%" }}
            >
              <Option value="Has Account">Has Bank Account</Option>
              <Option value="No Account">No Bank Account</Option>
            </Select>
          </Col>
        </Row>

        <Row style={{ marginTop: 20 }} justify="end">
          <Button type="primary" onClick={fetchAgents}>
            Submit
          </Button>
          <Button
            type="dashed"
            icon={<DownloadOutlined />}
            style={{ marginLeft: 10 }}
            onClick={handleDownload}
            disabled={!agents.length}
          >
            Download CSV
          </Button>
        </Row>
      </Card>
      <br />
      <Card className="registered-users-table">
        <Table
          dataSource={agents}
          columns={columns}
          rowKey="username"
          pagination={{ pageSize: 50 }}
        />
      </Card>
    </div>
  );
};

export default RegisteredUsersDownloadReports;
