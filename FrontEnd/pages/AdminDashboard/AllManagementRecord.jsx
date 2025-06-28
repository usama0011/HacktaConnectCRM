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
  Upload,
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
  InboxOutlined,
} from "@ant-design/icons";
import "../../styles/ManagerUsers.css";
const { Dragger } = Upload;
import moment from "moment"; // Make sure this is imported at the top
import { useNavigate } from "react-router-dom";
import API from "../../utils/BaseURL";
import { useUserContext } from "../../context/UserContext";
import axios from "axios";
const { Option } = Select;
const { confirm } = Modal;

const AllManagementRecord = () => {
  const [selectedRole, setSelectedRole] = useState("");

  const navigate = useNavigate();
    const { user } = useUserContext();
  const [users, setUsers] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [form] = Form.useForm();
const handleEditUser = (user) => {
  setEditingUser(user);
  setProfileImage(user.avatar || null);
  setSelectedFile(null); // Reset previously selected file

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
          "Super Admin": "volcano",
          "Assistant Floor Manager":"orange",
          hr: "geekblue",
          floormanager: "cyan",
          "Team Lead": "green",
          "Team Lead WFH": "lime",
          QC: "purple",
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
  title: "",
  key: "action",
  render: (text, record) => {
    const currentUserId = user?._id;
    const currentUserRole = user?.role;
    const targetUserId = record._id;
    const targetUserRole = record.role;

    const isSelf = currentUserId === targetUserId;

    const isSuperAdmin = currentUserRole === "Super Admin";
    const isHR = currentUserRole === "HR";
    const isFloorManager = currentUserRole === "Floor Manager";
    const isManagement = isSuperAdmin || isHR || isFloorManager;

    const isTargetSuperAdmin = targetUserRole === "Super Admin";

    let canEdit = false;
    let canDelete = false;

    // --- Edit Rules ---
    if (isSuperAdmin) {
      canEdit = true; // Super Admin can edit everyone
    } else if ((isHR || isFloorManager) && !isTargetSuperAdmin) {
      canEdit = true; // HR/Floor Manager can edit all except Super Admin
    } else if (isSelf) {
      canEdit = true; // Others can only edit themselves
    }

    // --- Delete Rules ---
    if (!isSelf) {
      if (isSuperAdmin) {
        canDelete = true; // Super Admin can delete others
      } else if ((isHR || isFloorManager) && !isTargetSuperAdmin) {
        canDelete = true; // HR/Floor Manager can delete others except Super Admin
      }
    } else {
      // No one can delete themselves now (including Others)
      canDelete = false;
    }

    const menuItems = [];

    if (canEdit) {
      menuItems.push(
        <Menu.Item key="edit" onClick={() => handleEditUser(record)}>
          Edit
        </Menu.Item>
      );
    }

    if (canDelete) {
      menuItems.push(
        <Menu.Item key="delete" onClick={() => handleDeleteUser(record)}>
          Delete
        </Menu.Item>
      );
    }

    if (menuItems.length === 0) {
      return (
        <Button
          shape="circle"
          icon={<MoreOutlined />}
          disabled
          title="No actions available"
        />
      );
    }

    return (
      <Dropdown overlay={<Menu>{menuItems}</Menu>} trigger={["click"]}>
        <Button shape="circle" icon={<MoreOutlined />} />
      </Dropdown>
    );
  },
}





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
        <div className="user-table-wrapperrrr">
          <Table
            columns={columns}
            dataSource={users}
            pagination={{ pageSize: 50 }}
            className="user-table"
          />
        </div>
      )}
      <Modal
        title="Edit User"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
<div style={{ textAlign: "center", marginBottom: 20 }}>
  {profileImage ? (
  <div style={{ textAlign: "center", marginBottom: 20 }}>
  {profileImage ? (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Avatar
        size={100}
        src={profileImage}
        icon={!profileImage && <UserOutlined />}
        style={{ borderRadius: "50%", marginBottom: 8 }}
      />
      <Button
        type="link"
        onClick={() => {
          setProfileImage(null);
          setSelectedFile(null);
        }}
      >
        Change Image
      </Button>
    </div>
  ) : (
    <Upload
      accept="image/*"
      showUploadList={false}
      beforeUpload={(file) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
          message.error("Only image files are allowed!");
          return Upload.LIST_IGNORE;
        }

        const previewUrl = URL.createObjectURL(file);
        setProfileImage(previewUrl);
        setSelectedFile(file);
        return false; // prevent auto upload
      }}
    >
      <Button icon={<InboxOutlined />}>Click or Drag Image to Upload</Button>
    </Upload>
  )}
</div>

  ) : (
    <Dragger
  name="file"
  multiple={false}
  showUploadList={false}
  accept="image/*"
  beforeUpload={(file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Only image files are allowed!");
      return Upload.LIST_IGNORE;
    }

    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);
    setSelectedFile(file);
    return false; // Prevent automatic upload
  }}
  style={{
    padding: 10,
    borderRadius: 8,
    background: "#fafafa",
  }}
>
  <p className="ant-upload-drag-icon">
    <InboxOutlined />
  </p>
  <p className="ant-upload-text">Click or drag user image to upload</p>
</Dragger>

  )}
</div>

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
    let uploadedImageUrl = profileImage;

    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const uploadRes = await axios.post(
        "https://hackta-connect-crm-client.vercel.app/api/upload",
        formData
      );

      console.log("Upload Response:", uploadRes.data);
      uploadedImageUrl = uploadRes.data.url;

      if (!uploadedImageUrl) {
        message.error("Image upload failed.");
        return;
      }
    }

    await API.put(`/auth/edit/${editingUser._id}`, {
      ...values,
      userImage: uploadedImageUrl,
    });

    message.success("User updated successfully!");
    setIsModalOpen(false);
    fetchUsers();
  } catch (err) {
    console.error("Update error:", err);
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
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
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
                  {selectedRole === "Super Admin" && (
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
