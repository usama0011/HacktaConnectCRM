import React, { useEffect, useState, memo } from "react";
import axios from "axios";
import { Modal, Button, Input, message, Spin } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Pie } from "@ant-design/plots";
import { isEqual } from "lodash-es";
import "../../styles/SmartProxy.css";
import API from "../../utils/BaseURL";

const SmartProxy = () => {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [whitelistIPs, setWhitelistIPs] = useState([]);
  const [newTag, setNewTag] = useState(""); // New
  const [subUsers, setSubUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newIP, setNewIP] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [subscriptionRes, whitelistRes, subUsersRes] = await Promise.all([
        API.get("/smartproxy/subscriptions"),
        API.get("/smartproxy/whitelisted-ips"),
        API.get("/smartproxy/sub-users"),
      ]);
      setSubscriptionData(subscriptionRes.data[0]);
      setWhitelistIPs(whitelistRes.data);
      setSubUsers(subUsersRes.data);
    } catch (error) {
      console.error("Error fetching SmartProxy data:", error);
      message.error("Failed to load SmartProxy data!");
    } finally {
      setLoading(false);
    }
  };

  const handleAddIP = async () => {
    if (!newIP.trim()) {
      message.warning("Please enter a valid IP address!");
      return;
    }
    setSubmitting(true);
    try {
      await API.post("/smartproxy/whitelisted-ips", {
        ip: newIP.trim(),
        tag: newTag.trim(), // <-- sending tag also
      });
      message.success("IP added successfully!");
      setModalVisible(false);
      setNewIP("");
      setNewTag(""); // clear tag too

      fetchAllData();
    } catch (error) {
      console.error("Error adding IP:", error);
      message.error("Failed to add IP!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteIP = async (id) => {
    try {
      await API.delete(`/smartproxy/whitelisted-ips/${id}`);
      message.success("IP deleted successfully!");
      fetchAllData();
    } catch (error) {
      console.error("Error deleting IP:", error);
      message.error("Failed to delete IP!");
    }
  };

  const trafficData = subUsers.map((user) => ({
    type: user.username,
    value: user.traffic,
  }));

  const DemoPie = memo(
    ({ data }) => {
      const config = {
        data,
        angleField: "value",
        colorField: "type",
        radius: 1,
        innerRadius: 0.6, // Donut
        height: 400, // <--- ADD THIS
        label: {
          type: "outer",
          content: "{name}: {percentage}",
        },
        interactions: [{ type: "element-active" }],
      };
      return <Pie {...config} />;
    },
    (prev, next) => isEqual(prev?.data, next?.data)
  );

  if (loading) {
    return (
      <div className="smartproxy-container">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }
  console.log(trafficData);
  return (
    <div className="smartproxy-container">
      <h1 className="smartproxy-heading">Decodo Subscription Dashboard</h1>

      {/* Subscription Info */}
      {subscriptionData ? (
        <ul className="smartproxy-list smartproxy-section">
          <li>
            <strong>Traffic Limit:</strong> {subscriptionData.traffic_limit} GB
          </li>
          <li>
            <strong>Traffic Used:</strong> {subscriptionData.traffic} GB
          </li>
          <li>
            <strong>Valid From:</strong> {subscriptionData.valid_from}
          </li>
          <li>
            <strong>Valid Until:</strong> {subscriptionData.valid_until}
          </li>
          <li>
            <strong>Proxy Users Limit:</strong>{" "}
            {subscriptionData.proxy_users_limit}
          </li>
          <li>
            <strong>IP Address Limit:</strong>{" "}
            {subscriptionData.ip_address_limit}
          </li>
        </ul>
      ) : (
        <p>No subscription data available.</p>
      )}

      {/* Whitelisted IPs */}
      <div className="smartproxy-section">
        <h2>Whitelisted IPs</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
          style={{ marginBottom: "16px" }}
        >
          Add New IP
        </Button>

        {whitelistIPs.length > 0 ? (
          <ul className="smartproxy-list">
            {whitelistIPs.map((ip) => (
              <li key={ip.id} className="smartproxy-ip-item">
                <div>
                  <strong>{ip.ip}</strong> {ip.tag ? `(${ip.tag})` : ""}
                  <br />
                  <small>Added on: {ip.created_at}</small>
                </div>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteIP(ip.id)}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No whitelisted IPs found.</p>
        )}
      </div>

      {/* Sub Users Section */}
      <div className="smartproxy-section">
        <h2>Sub Users</h2>
        {subUsers.length > 0 ? (
          <ul className="smartproxy-list">
            {subUsers.map((user) => (
              <li key={user.id}>
                <div>
                  <strong>Username:</strong> {user.username} <br />
                  <strong>Status:</strong> {user.status} <br />
                  <strong>Traffic Used:</strong> {user.traffic} GB <br />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No sub users found.</p>
        )}
      </div>

      {/* Chart Section */}
      <div className="">
        <h2>Sub Users Traffic Usage (Donut Chart)</h2>

        <DemoPie data={trafficData} />
      </div>

      {/* Modal for Adding New IP */}
      <Modal
        title="Add New Whitelisted IP"
        open={modalVisible}
        onOk={handleAddIP}
        onCancel={() => setModalVisible(false)}
        okText="Add IP"
        confirmLoading={submitting}
      >
        <Input
          placeholder="Enter IP address"
          value={newIP}
          onChange={(e) => setNewIP(e.target.value)}
        />
        <br />
        <Input
          placeholder="Enter Tag (Optional)"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default SmartProxy;
