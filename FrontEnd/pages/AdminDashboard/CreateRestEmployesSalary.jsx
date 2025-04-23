import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Avatar,
  Input,
  Space,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  BankOutlined,
  IdcardOutlined,
  DollarCircleOutlined,
  CalendarOutlined,
  AimOutlined,
  FieldNumberOutlined,
  BarChartOutlined,
  FundViewOutlined,
  TrophyOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "../../styles/AgentsSalaryRecord.css";

const { Option } = Select;
const { MonthPicker } = DatePicker;

const AgentsSalaryRecord = () => {
  const dummyData = [
    {
      key: "1",
      name: "Ahsan Ali",
      avatar: "",
      bankName: "HBL",
      accountTitle: "Ahsan Ali",
      accountNo: "1234567890",
      joiningDate: "2022-05-12",
      cnic: "35201-1234567-1",
      sessions: 22,
      clicks: 101,
      totalIps: 123,
      salary: 42000,
      absenties: 1,
      absentFine: 500,
      qcPoints: 145,
      qcBonus: 3000,
      bonus: 1000,
      netSalary: 43500,
    },
    {
      key: "2",
      name: "Ahsan Ali",
      avatar: "",
      bankName: "HBL",
      accountTitle: "Ahsan Ali",
      accountNo: "1234567890",
      joiningDate: "2022-05-12",
      cnic: "35201-1234567-1",
      sessions: 22,
      clicks: 101,
      totalIps: 123,
      salary: 42000,
      absenties: 1,
      absentFine: 500,
      qcPoints: 145,
      qcBonus: 3000,
      bonus: 1000,
      netSalary: 43500,
    },
    {
      key: "3",
      name: "Ahsan Ali",
      avatar: "",
      bankName: "HBL",
      accountTitle: "Ahsan Ali",
      accountNo: "1234567890",
      joiningDate: "2022-05-12",
      cnic: "35201-1234567-1",
      sessions: 22,
      clicks: 101,
      totalIps: 123,
      salary: 42000,
      absenties: 1,
      absentFine: 500,
      qcPoints: 145,
      qcBonus: 3000,
      bonus: 1000,
      netSalary: 43500,
    },
  ];
  const [filters, setFilters] = useState({
    shift: "",
    agentType: "",
    month: moment(),
  });
  const [visibleData, setVisibleData] = useState(dummyData);

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const columns = [
    {
      title: (
        <span>
          <UserOutlined /> Agent Name
        </span>
      ),
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      fixed: "left", // 👈 make it sticky
      width: 220, // 👈 required for fixed columns
      render: (text, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          {text}
        </Space>
      ),
    },
    {
      title: (
        <span>
          <BankOutlined /> Bank Name
        </span>
      ),
      dataIndex: "bankName",
      key: "bankName",
    },
    {
      title: (
        <span>
          <UserOutlined /> Account Title
        </span>
      ),
      dataIndex: "accountTitle",
      key: "accountTitle",
    },
    {
      title: (
        <span>
          <FieldNumberOutlined /> Account No
        </span>
      ),
      dataIndex: "accountNo",
      key: "accountNo",
    },
    {
      title: (
        <span>
          <CalendarOutlined /> Joining Date
        </span>
      ),
      dataIndex: "joiningDate",
      key: "joiningDate",
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
          <AimOutlined /> Sessions
        </span>
      ),
      dataIndex: "sessions",
      key: "sessions",
    },
    {
      title: (
        <span>
          <BarChartOutlined /> Clicks
        </span>
      ),
      dataIndex: "clicks",
      key: "clicks",
    },
    {
      title: (
        <span>
          <FundViewOutlined /> Total IPs
        </span>
      ),
      dataIndex: "totalIps",
      key: "totalIps",
    },
    {
      title: (
        <span>
          <DollarCircleOutlined /> Salary
        </span>
      ),
      dataIndex: "salary",
      key: "salary",
      render: (value) => `Rs ${value}`,
    },
    {
      title: (
        <span>
          <UserOutlined /> Absenties
        </span>
      ),
      dataIndex: "absenties",
      key: "absenties",
    },
    {
      title: (
        <span>
          <DollarCircleOutlined /> Absent Fine
        </span>
      ),
      dataIndex: "absentFine",
      key: "absentFine",
    },
    {
      title: (
        <span>
          <TrophyOutlined /> QC Points
        </span>
      ),
      dataIndex: "qcPoints",
      key: "qcPoints",
    },
    {
      title: (
        <span>
          <GiftOutlined /> QC Bonus
        </span>
      ),
      dataIndex: "qcBonus",
      key: "qcBonus",
    },
    {
      title: (
        <span>
          <GiftOutlined /> Bonus
        </span>
      ),
      dataIndex: "bonus",
      key: "bonus",
    },
    {
      title: (
        <span>
          <DollarCircleOutlined /> Net Salary
        </span>
      ),
      dataIndex: "netSalary",
      key: "netSalary",
      render: (value) => (
        <span style={{ fontWeight: "bold", color: "#003c2f" }}>Rs {value}</span>
      ),
    },
  ];

  useEffect(() => {
    let filtered = [...dummyData];

    if (filters.shift) {
      filtered = filtered.filter((item) => item.shift === filters.shift);
    }
    if (filters.agentType) {
      filtered = filtered.filter(
        (item) => item.agentType === filters.agentType
      );
    }

    // You can filter by month later if needed using filters.month
    setVisibleData(filtered);
  }, [filters]);

  return (
    <div className="salaryRecord-container">
      <h1 className="salaryRecord-heading">
        Hackta Connect - Agents Salary Record
      </h1>

      <Card className="salaryRecord-filterCard">
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <label>Shift</label>
            <Select
              value={filters.shift}
              onChange={(value) => handleFilterChange("shift", value)}
              placeholder="Select Shift"
              className="salaryRecord-select"
              allowClear
            >
              <Option value="Morning">Morning</Option>
              <Option value="Evening">Evening</Option>
              <Option value="Night">Night</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <label>Agent Type</label>
            <Select
              value={filters.agentType}
              onChange={(value) => handleFilterChange("agentType", value)}
              placeholder="Select Agent Type"
              className="salaryRecord-select"
              allowClear
            >
              <Option value="Office Agent">Office Agent</Option>
              <Option value="WFH Agent">WFH Agent</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <label>Select Month</label>
            <MonthPicker
              value={filters.month}
              onChange={(date) => handleFilterChange("month", date)}
              className="salaryRecord-datePicker"
              placeholder="Select Month"
              format="MMMM YYYY"
            />
          </Col>
        </Row>
      </Card>
      <br />
      <div className="top-agents-wrapper">
        <h2 className="top-agents-title">🏆 Top 5 Agents</h2>
        <Row gutter={[24, 24]}>
          {visibleData
            .sort((a, b) => b.netSalary - a.netSalary)
            .slice(0, 5)
            .map((agent) => (
              <Col key={agent.key} xs={24} sm={12} md={8} lg={6}>
                <Card className="top-agent-card" hoverable>
                  <Space>
                    <Avatar
                      size="large"
                      src={agent.avatar}
                      icon={<UserOutlined />}
                    />
                    <div>
                      <p className="top-agent-name">{agent.name}</p>
                      <p className="top-agent-salary">Rs {agent.netSalary}</p>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
        </Row>
      </div>
      <br />

      <div className="ageintsalaryrecordtable">
        <Table
          dataSource={dummyData}
          columns={columns}
          pagination={{ pageSize: 6 }}
          rowKey="key"
          scroll={{ x: 3010 }} // enable horizontal scroll
        />
      </div>
    </div>
  );
};

export default AgentsSalaryRecord;
