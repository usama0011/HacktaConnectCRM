import React from "react";
import { Layout, Row, Col, Card, Typography, Button } from "antd";
import { Outlet } from "react-router-dom";
import "../../styles/AdminDashboard.css";
import DateTimeDisplay from "../../components/DateTimeDisplay";
import OverViewMiniDetailCards from "../../components/OverviewCard";
import AdminRegisterProxyStats from "../../components/AdminRegisterProxyStats";
import AgentSalaryAggrigation from "./CreateAgentsSalary";
const { Content } = Layout;
const { Title, Text } = Typography;

const AdminDashboard = () => {
  return (
    <Content className="admin-dashboard-page">
      <DateTimeDisplay />

      <div className="">
        {/* overdeails */}
        <OverViewMiniDetailCards />
        <div className="CRM-leaderboard-wrapper">
          <div className="CRM-leaderboard-ribbon">
            <div className="CRM-ribbon-left"></div>
            <div className="CRM-ribbon-center">Company Statistics</div>
            <div className="CRM-ribbon-right"></div>
          </div>
        </div>

        <AdminRegisterProxyStats />

        <div className="CRM-leaderboard-wrapper">
          <div className="CRM-leaderboard-ribbon">
            <div className="CRM-ribbon-left"></div>
            <div className="CRM-ribbon-center">Download Statistics</div>
            <div className="CRM-ribbon-right"></div>
          </div>
        </div>
      </div>
      <br />
      <AgentSalaryAggrigation />
      <Outlet />
    </Content>
  );
};

export default AdminDashboard;
