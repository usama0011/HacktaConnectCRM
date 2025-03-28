import React, { useState } from "react";
import { Table, Tag, Avatar, Button, Input, Dropdown, Menu } from "antd";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import "../../styles/ManagerUsers.css";

const ManagerUsers = () => {
  // Dummy Data
  const users = [
    {
      key: "1",
      name: "Jhon Clavio",
      role: "Product Designer",
      shift: "morning",
      status: "Active",
      createdAt: "April 14, 2022",
      avatar: "https://i.pravatar.cc/40?img=1",
    },
    {
      key: "2",
      name: "Alex Smith",
      role: "Product Designer",
      shift: "morning",
      status: "Inactive",
      createdAt: "April 10, 2022",
      avatar: "https://i.pravatar.cc/40?img=2",
    },
    {
      key: "3",
      name: "Saleh Mohasoy",
      role: "Product Designer",
      shift: "evening",
      status: "Active",
      createdAt: "April 5, 2022",
      avatar: "https://i.pravatar.cc/40?img=3",
    },
    {
      key: "4",
      name: "Power Boy",
      role: "Product Designer",
      shift: "night",
      status: "Pending",
      createdAt: "April 4, 2022",
      avatar: "https://i.pravatar.cc/40?img=4",
    },
    {
      key: "5",
      name: "Ruhan Ibn Tajul",
      role: "Product Designer",
      shift: "morning",
      status: "Active",
      createdAt: "April 2, 2022",
      avatar: "https://i.pravatar.cc/40?img=5",
    },
    {
      key: "6",
      name: "Kilan James",
      role: "Product Designer",
      shift: "evening",
      status: "Pending",
      createdAt: "March 18, 2022",
      avatar: "https://i.pravatar.cc/40?img=6",
    },
    {
      key: "7",
      name: "Thomas Flecthure",
      role: "Product Designer",
      shift: "night",
      status: "Inactive",
      createdAt: "March 14, 2022",
      avatar: "https://i.pravatar.cc/40?img=7",
    },
    {
      key: "8",
      name: "Hamidi Ibrahim",
      role: "Product Designer",
      shift: "morning",
      status: "Active",
      createdAt: "March 10, 2022",
      avatar: "https://i.pravatar.cc/40?img=8",
    },
  ];

  // Table Columns
  const columns = [
    {
      title: "Created By",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="user-info">
          <Avatar src={record.avatar} />
          <div>
            <span className="user-name">{text}</span>
            <p className="user-role">{record.role}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Shift",
      dataIndex: "shift",
      key: "shift",
      render: (shift) => (
        <Tag
          color={
            shift === "morning"
              ? "blue"
              : shift === "evening"
              ? "orange"
              : "purple"
          }
        >
          {shift}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Active"
              ? "green"
              : status === "Pending"
              ? "gold"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
    },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt" },
    {
      title: "",
      key: "action",
      render: () => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item>Edit</Menu.Item>
              <Menu.Item>Delete</Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button shape="circle" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="user-manager-container">
      <div className="user-header">
        <h2 className="user-title">User Management</h2>
        <div className="user-actions">
          <Input
            placeholder="Search Users..."
            prefix={<SearchOutlined />}
            className="user-search"
          />
          <Button type="primary" className="user-new-button">
            + New User
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        pagination={{ pageSize: 5 }}
        className="user-table"
      />
    </div>
  );
};

export default ManagerUsers;
