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
  EditOutlined,
} from "@ant-design/icons";
import "../../styles/ManagerUsers.css";
import ProjectInfoCard from "../../components/ProjectInfoCard";
import API from "../../utils/BaseURL";
import moment from "moment"; // Make sure this is imported at the top
import { useNavigate } from "react-router-dom";
const { Option } = Select;
const { confirm } = Modal;

const AllAgentsRegistraction = () => {
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
      const res = await API.get("/auth/agents", {
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
        CreatedBy: user.CreatedBy || "",
        joiningDate: user.joiningDate
          ? new Date(user.joiningDate).toLocaleDateString()
          : "—",
        cnic: user.cnic || "—",
        createdAt: new Date(user.createdAt).toLocaleDateString(),
        avatar: user.userImage || "",
        editHistory: user.editHistory || [],
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching agents:", error);
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
    agent: "gold",
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
      width: 200, // ✅
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
      width: 200, // ✅
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
          <IdcardOutlined style={{ marginRight: 6 }} />
          Role
        </span>
      ),
      dataIndex: "role",
      key: "role",
      width: 200, // ✅
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
      title: (
        <span>
          <BankOutlined style={{ marginRight: 6 }} />
          Branch
        </span>
      ),
      dataIndex: "branch",
      key: "branch",
      width: 200, // ✅
    },
    {
      title: (
        <span>
          <CalendarOutlined style={{ marginRight: 6 }} />
          Joining Date
        </span>
      ),
      dataIndex: "joiningDate",
      key: "joiningDate",
      width: 200, // ✅
    },
    {
      title: (
        <span>
          <BankOutlined style={{ marginRight: 6 }} />
          Bank Name
        </span>
      ),
      dataIndex: "bankName",
      key: "bankName",
      width: 200, // ✅
    },
    {
      title: (
        <span>
          <CalendarOutlined style={{ marginRight: 6 }} />
          Account Title
        </span>
      ),
      dataIndex: "accountTitle",
      key: "accountTitle",
      width: 200, // ✅
    },
    {
      title: (
        <span>
          <NumberOutlined style={{ marginRight: 6 }} />
          Account NO
        </span>
      ),
      dataIndex: "bankNumber",
      key: "bankNumber",
      width: 200, // ✅
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
      width: 200, // ✅
    },
    {
      title: (
        <span>
          <EditOutlined style={{ marginRight: 6 }} />
          Created By
        </span>
      ),
      dataIndex: "CreatedBy",
      key: "CreatedBy",
      width: 200, // ✅
    },
    {
      title: "",
      key: "action",
      width: 100, // ✅ Keep action button smaller
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
            placeholder="Agent Type"
            onChange={(value) => fetchUsers({ agentType: value })}
          >
            <Option value="Office Agent">Office Agent</Option>
            <Option value="WFH Agent">Work From Home Agent</Option>
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
      {/* <ProjectInfoCard
        titleproject="User Management"
        projectdes="Manage all registered users from the system."
      /> */}

      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <div className="user-table-wrapperrrr">
          <Table
            columns={columns}
            dataSource={users}
            scroll={{ x: "max-content" }} // ✅ Allow horizontal scroll
            pagination={{ pageSize: 30 }}
            className="user-table"
          />
        </div>
      )}
      <Modal
        title="Edit User"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={900} // 🆕 Add this line (you can set 800, 900, 1000 depending on what you want)
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

              await API.put(`/auth/edit/${editingUser._id}`, {
                ...values,
                editorUsername: "Admin",
                editorAvatar: "https://via.placeholder.com/40",
              });

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
            <Col xs={24} md={8}>
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="agentName"
                label="Agent Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="accountTitle"
                label="Account Title"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                <Select onChange={(value) => setSelectedRole(value)}>
                  <Option value="Super Admin">Super Admin</Option>
                  <Option value="HR">HR</Option>
                  <Option value="Floor Manager">Floor Manager</Option>
                  <Option value="Assistant Floor Manager">
                    Assistant Floor Manager
                  </Option>
                  <Option value="Team Lead">Team Lead</Option>
                  <Option value="Team Lead WFH">Team Lead (WFH)</Option>
                  <Option value="QC">Quality Control (QC)</Option>
                  <Option value="agent">Agent</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="shift"
                label="Shift"
                rules={[{ required: true }]}
              >
                <Select>
                  {["Super Admin", "HR", "Floor Manager"].includes(
                    selectedRole
                  ) && <Option value="allshifts">All Shifts</Option>}
                  <Option value="morning">Morning</Option>
                  <Option value="evening">Evening</Option>
                  <Option value="night">Night</Option>
                  {selectedRole === "Assistant Floor Manager" && (
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
              <Col xs={24} md={8}>
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
            <Col xs={24} md={8}>
              <Form.Item
                name="bankName"
                label="Bank Name"
                rules={[{ required: true }]}
              >
                <Input prefix={<BankOutlined />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="bankNumber"
                label="Account No"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="joiningDate"
                label="Joining Date"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
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
            <Col xs={24} md={8}>
              <Form.Item
                name="branch"
                label="Branch"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select Branch">
                  {selectedRole === "Super Admin" && (
                    <Option value="All Branches">All Branches</Option>
                  )}
                  <Option value="Branch A">Branch A</Option>
                  <Option value="Branch B">Branch B</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              {/* Empty or you can put extra field here */}
            </Col>
          </Row>

          <Form.Item>
            <Button
              style={{ backgroundColor: "#1e2d7d" }}
              type="primary"
              htmlType="submit"
              block
              loading={editLoading}
            >
              Update User
            </Button>
          </Form.Item>
        </Form>

        <div>
          {editingUser?.editHistory && editingUser.editHistory.length > 0 && (
            <div className="edit-history-section">
              <h3 className="edit-history-title">Edit History</h3>
              <div className="edit-history-list">
                {editingUser.editHistory
                  .slice()
                  .reverse()
                  .map((history, idx) => (
                    <div key={idx} className="edit-history-item">
                      <Avatar src={history.editedByAvatar || ""} size={40} />
                      <div className="edit-history-details">
                        <span className="edit-history-username">
                          {history.editedByUsername || "Unknown User"}
                        </span>
                        <span className="edit-history-time">
                          {moment(history.editedAt).format(
                            "DD MMM YYYY, h:mm A"
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AllAgentsRegistraction;
