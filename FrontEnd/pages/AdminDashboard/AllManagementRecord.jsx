import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Avatar,
  Button,
  Input,
  Dropdown,
  Menu,
  Skeleton,
  Modal,
  message,
  Row,
  Col,
  Select,
  DatePicker,
  Form,
} from "antd";

import {
  SearchOutlined,
  MoreOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  IdcardOutlined,
  BankOutlined,
  NumberOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "../../styles/ManagerUsers.css";
import ProjectInfoCard from "../../components/ProjectInfoCard";
import axios from "axios";
import moment from "moment"; // Make sure this is imported at the top
import { useNavigate } from "react-router-dom";
import API from "../../utils/BaseURL";
const { Option } = Select;
const { confirm } = Modal;

const AllManagementRecord = () => {
  const [selectedRole, setSelectedRole] = useState("");

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [form] = Form.useForm();
  const handleEditUser = (user) => {
    setEditingUser(user);

    // Fix joiningDate field
    const formValues = {
      ...user,
      joiningDate: user.joiningDate ? moment(user.joiningDate) : null,
    };

    form.setFieldsValue(formValues);
    setIsModalOpen(true);
  };
  const fetchUsers = async (filters = {}) => {
    setLoading(true);
    try {
      const res = await API.get("/auth/management", {
        params: filters,
      });
      const formattedUsers = res.data.map((user) => ({
        key: user._id,
        _id: user._id,
        username: user.username,
        role: user.role,
        shift: user.shift,
        agentType: user.agentType || "—",
        agentName: user.agentName || "—",
        accountTitle: user.accountTitle || "—",
        bankName: user.bankName || "—",
        bankNumber: user.bankNumber || "—",
        branch: user.branch || "—",
        joiningDate: user.joiningDate
          ? new Date(user.joiningDate).toLocaleDateString()
          : "—",
        cnic: user.cnic || "—",
        createdAt: new Date(user.createdAt).toLocaleDateString(),
        avatar: user.userImage || "",
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching management users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const roleColors = {
    "Super Admin": "volcano",
    hr: "geekblue",
    "Floor Manager": "cyan",
    "Team Lead": "green",
    "teamleadwfh WFH": "lime",
    "Quality Control": "purple",
    Agent: "gold",
    User: "magenta",
  };
  const handleDeleteUser = (user) => {
    confirm({
      title: `Are you sure you want to delete "${user.username}"?`,
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, delete",
      okType: "danger",
      cancelText: "Cancel",
      className: "delete-confirm-modal", // Optional if you want to target modal body as well
      onOk: async () => {
        try {
          await API.delete(`/auth/delete/${user._id}`);
          message.success("User deleted successfully!");
          fetchUsers();
        } catch (error) {
          message.error("Failed to delete user.");
        }
      },
      // ✅ Apply footer customization through CSS globally
    });
  };
  const columns = [
    {
      title: (
        <span>
          <UserOutlined style={{ marginRight: 6 }} />
          User
        </span>
      ),
      dataIndex: "username",
      key: "username",
      render: (text, record) => (
        <div className="user-info">
          <Avatar src={record.avatar} />
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="user-name" style={{ textTransform: "capitalize" }}>
              {text}
            </span>
          </div>
        </div>
      ),
    },

    {
      title: (
        <span>
          <ClockCircleOutlined style={{ marginRight: 6 }} />
          Shift
        </span>
      ),
      dataIndex: "shift",
      key: "shift",
      render: (shift) => (
        <Tag
          style={{ textTransform: "capitalize" }}
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
      title: (
        <span>
          <CalendarOutlined style={{ marginRight: 6 }} />
          Created At
        </span>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: (
        <span>
          <IdcardOutlined style={{ marginRight: 6 }} />
          Role
        </span>
      ),
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const roleColors = {
          superadmin: "volcano",
          hr: "geekblue",
          floormanager: "cyan",
          teamlead: "green",
          teamleadwfh: "lime",
          qc: "purple",
          agent: "gold",
          user: "magenta",
        };

        return (
          <Tag
            color={roleColors[role] || "default"}
            style={{ textTransform: "capitalize" }}
          >
            {role}
          </Tag>
        );
      },
    },

    {
      title: "", // For actions (no header icon)
      key: "action",
      render: (text, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item onClick={() => handleEditUser(record)}>Edit</Menu.Item>
              <Menu.Item onClick={() => handleDeleteUser(record)}>
                Delete
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button shape="circle" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];
  //two cards one for the Agents and one the Management.
  return (
    <div className="user-manager-container">
      <div className="user-header">
        <div className="user-actions">
          <Button
            onClick={() => navigate("/admin/dashboard/addnewuser")}
            type="primary"
            className="addnewuserfronres"
          >
            + New User
          </Button>
        </div>
      </div>
      <Row gutter={16} className="filter-section-registractions">
        <Col>
          <Input
            placeholder="Search by Username"
            onChange={(e) => fetchUsers({ username: e.target.value })}
          />
        </Col>
        <Col>
          <Select
            placeholder="Shift"
            onChange={(value) => fetchUsers({ shift: value })}
          >
            <Option value="morning">Morning</Option>
            <Option value="evening">Evening</Option>
            <Option value="night">Night</Option>
          </Select>
        </Col>
        <Col>
          <Select
            placeholder="Branch"
            onChange={(value) => fetchUsers({ branch: value })}
          >
            <Option value="Branch A">Branch A</Option>
            <Option value="Branch B">Branch B</Option>
          </Select>
        </Col>
      </Row>
      <br />

      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <Table
          columns={columns}
          dataSource={users}
          pagination={{ pageSize: 5 }}
          className="user-table"
        />
      )}
      <Modal
        title="Edit User"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          requiredMark={false}
          layout="vertical"
          form={form}
          onFinish={async (values) => {
            try {
              if (!editingUser || !editingUser._id) {
                message.error("User ID is missing. Cannot update.");
                return;
              }
              setEditLoading(true);
              await API.put(`/auth/edit/${editingUser._id}`, values);
              message.success("User updated successfully!");
              setIsModalOpen(false);
              fetchUsers();
            } catch (err) {
              message.error("Update failed. Try again.");
            } finally {
              setEditLoading(false);
            }
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="agentName"
                label="Agent Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="accountTitle"
                label="Account Title"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                <Select onChange={(value) => setSelectedRole(value)}>
                  <Option value="superadmin">Super Admin</Option>
                  <Option value="hr">HR</Option>
                  <Option value="floormanager">Floor Manager</Option>
                  <Option value="assistancefloormanager">
                    Assistant Floor Manager
                  </Option>
                  <Option value="teamlead">Team Lead</Option>
                  <Option value="teamleadwfh">Team Lead (WFH)</Option>
                  <Option value="qualitycontrol">Quality Control (QC)</Option>
                  <Option value="agent">Agent</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="shift"
                label="Shift"
                rules={[{ required: true }]}
              >
                <Select>
                  {["superadmin", "hr", "floormanager"].includes(
                    selectedRole
                  ) && <Option value="allshifts">All Shifts</Option>}
                  <Option value="morning">Morning</Option>
                  <Option value="evening">Evening</Option>
                  <Option value="night">Night</Option>
                  {selectedRole === "assistancefloormanager" && (
                    <>
                      <Option value="morning-evening">Morning & Evening</Option>
                      <Option value="evening-night">Evening & Night</Option>
                      <Option value="night-morning">Night & Morning</Option>
                    </>
                  )}
                </Select>
              </Form.Item>
            </Col>

            {selectedRole === "agent" && (
              <Col xs={24} md={12}>
                <Form.Item
                  name="agentType"
                  label="Agent Type"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="Office Agent">Office Agent</Option>
                    <Option value="WFH Agent">Work From Home Agent</Option>
                  </Select>
                </Form.Item>
              </Col>
            )}
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="bankName"
                label="Bank Name"
                rules={[{ required: true }]}
              >
                <Input prefix={<BankOutlined />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="bankNumber"
                label="Bank Number"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="joiningDate"
                label="Joining Date"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="cnic"
                label="CNIC"
                rules={[
                  { required: true },
                  {
                    pattern: /^[0-9]{13}$/,
                    message: "CNIC must be exactly 13 digits",
                  },
                ]}
              >
                <Input maxLength={13} placeholder="3520112345671" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="branch"
                label="Branch"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select Branch">
                  {selectedRole === "superadmin" && (
                    <Option value="All Branches">All Branches</Option>
                  )}
                  <Option value="Branch A">Branch A</Option>
                  <Option value="Branch B">Branch B</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={editLoading}
            >
              Update User
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AllManagementRecord;
