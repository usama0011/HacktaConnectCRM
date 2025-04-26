import React, { useState } from "react";
import {
  DatePicker,
  Input,
  Select,
  Card,
  Row,
  Col,
  Table,
  Avatar,
  Divider,
  Space,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
  FrownOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import moment from "moment";

import "../../styles/GeneralSalaryCalculator.css"; // Create this later for better styling

const { RangePicker } = DatePicker;
const { Option } = Select;

const GeneralSalaryCalculator = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    username: "",
    shift: "",
    agentType: "",
    cnic: "",
    agentName: "",
    branch: "",
    dateRange: [moment().startOf("month"), moment().endOf("month")],
  });

  const dummyData = [
    {
      key: "1",
      avatar: "",
      name: "John Doe",
      username: "johndoe",
      shift: "Morning",
      agentType: "Office Agent",
      cnic: "35201-1234567-1",
      agentName: "JD",
      branch: "Main",
      sessions: 25,
      clicks: 120,
      totalIps: 145,
      salary: 42000,
      absentDays: 2,
      leaveDays: 1,
      bonus: 1000,
      fine: 500,
    },
  ];

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  return (
    <div className="generalSalary-container">
      <h1 className="generalSalary-heading">
        Hackta Connect - General Salary Calculator
      </h1>

      <Card className="generalSalary-filterCard">
        <Row gutter={16}>
          <Col span={8}>
            <label>Branch</label>
            <Input
              placeholder="Enter branch"
              value={filters.branch}
              onChange={(e) => handleFilterChange("branch", e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Row gutter={16}>
              <Col span={12}>
                <label>Username</label>
                <Input
                  placeholder="Enter username"
                  value={filters.username}
                  onChange={(e) =>
                    handleFilterChange("username", e.target.value)
                  }
                />
              </Col>
              <Col span={12}>
                <label>Agent Name</label>
                <Input
                  placeholder="Enter agent name"
                  value={filters.agentName}
                  onChange={(e) =>
                    handleFilterChange("agentName", e.target.value)
                  }
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <Divider />

        <Row gutter={16}>
          <Col span={8}>
            <label>Shift</label>
            <Select
              placeholder="Select shift"
              value={filters.shift}
              onChange={(value) => handleFilterChange("shift", value)}
              allowClear
              className="generalSalary-select"
            >
              <Option value="Morning">Morning</Option>
              <Option value="Evening">Evening</Option>
              <Option value="Night">Night</Option>
            </Select>
          </Col>
          <Col span={8}>
            <label>Agent Type</label>
            <Select
              placeholder="Select agent type"
              value={filters.agentType}
              onChange={(value) => handleFilterChange("agentType", value)}
              allowClear
              className="generalSalary-select"
            >
              <Option value="Office Agent">Office Agent</Option>
              <Option value="WFH Agent">WFH Agent</Option>
            </Select>
          </Col>
        </Row>
      </Card>
      <Row justify="end" style={{ marginTop: "24px" }}>
        <Col>
          <button
            onClick={() => {
              const filtered = dummyData.filter((item) => {
                return (
                  (!filters.username ||
                    item.username
                      .toLowerCase()
                      .includes(filters.username.toLowerCase())) &&
                  (!filters.agentName ||
                    item.agentName
                      .toLowerCase()
                      .includes(filters.agentName.toLowerCase())) &&
                  (!filters.shift || item.shift === filters.shift) &&
                  (!filters.agentType ||
                    item.agentType === filters.agentType) &&
                  (!filters.branch ||
                    item.branch
                      .toLowerCase()
                      .includes(filters.branch.toLowerCase())) &&
                  (!filters.cnic || item.cnic.includes(filters.cnic))
                );
              });
              setFilteredData(filtered);
            }}
            className="generalSalary-applyBtn"
          >
            Apply Filter
          </button>
        </Col>
      </Row>
    </div>
  );
};

export default GeneralSalaryCalculator;
