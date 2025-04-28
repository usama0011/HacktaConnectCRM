import React, { useState, useEffect } from "react";
import { Table, Card, Row, Col, Select, DatePicker, Avatar, Space } from "antd";
import {
  UserOutlined,
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
import API from "../../utils/BaseURL";

const { Option } = Select;
const { RangePicker } = DatePicker;

const AgentsSalaryRecord = () => {
  const [filters, setFilters] = useState({
    shift: "",
    agentType: "",
    dateRange: [moment().startOf("month"), moment().endOf("month")],
  });
  const [visibleData, setVisibleData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2 && dates[0] && dates[1]) {
      setFilters({ ...filters, dateRange: dates });
    } else {
      setFilters({
        ...filters,
        dateRange: [moment().startOf("month"), moment().endOf("month")],
      });
      // Reset to current month if invalid
    }
  };

  const fullColumns = [
    {
      title: (
        <span>
          <UserOutlined /> Agent Name
        </span>
      ),
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      fixed: "left",
      width: 220,
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
          <DollarCircleOutlined /> Gross Salary
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

  const wfhColumns = fullColumns.filter(
    (col) =>
      !["absenties", "absentFine", "qcPoints", "qcBonus"].includes(
        col.dataIndex
      )
  );

  const columns = filters.agentType === "WFH Agent" ? wfhColumns : fullColumns;

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/salary/calculate`, {
          params: {
            shift: filters.shift,
            agentType: filters.agentType,
            startDate: filters.dateRange[0].format("YYYY-MM-DD"),
            endDate: filters.dateRange[1].format("YYYY-MM-DD"),
          },
        });
        setVisibleData(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Failed to fetch salary data", error);
      } finally {
        setLoading(false);
      }
    };

    if (filters.agentType) {
      fetchSalaryData();
    }
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
              <Option value="morning">Morning</Option>
              <Option value="evening">Evening</Option>
              <Option value="night">Night</Option>
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
            <label>Select Date Range</label>
            <RangePicker
              value={filters.dateRange}
              onChange={handleDateRangeChange}
              format="YYYY-MM-DD"
              disabledDate={(current) =>
                current && current > moment().endOf("day")
              }
              allowClear={false} // 👈 Important: Disable clearing empty dates
              className="salaryRecord-datePicker"
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
          dataSource={visibleData}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 6 }}
          rowKey="key"
          scroll={{ x: 3010 }}
        />
      </div>
    </div>
  );
};

export default AgentsSalaryRecord;
