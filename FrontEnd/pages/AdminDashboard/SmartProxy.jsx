import React, { useEffect, useState } from "react";
import { Modal, Button, Input, message, Spin, Card, Row, Col } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Pie } from "@ant-design/plots";
import "../../styles/smartproxy.css";
import ChartUp from "../../src/assets/chartup.png";
import Insights from "../../src/assets/Insights.png";
import ProxyPng from "../../src/assets/proxy.png";
import TeamAdmin from "../../src/assets/proxy.png";
import API from "../../utils/BaseURL";

const SmartProxy = () => {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [whitelistIPs, setWhitelistIPs] = useState([]);
  const [newTag, setNewTag] = useState("");
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
        tag: newTag.trim(),
      });
      message.success("IP added successfully!");
      setModalVisible(false);
      setNewIP("");
      setNewTag("");
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
    type: user.username.charAt(0).toUpperCase() + user.username.slice(1),
    value: user.traffic,
  }));

  const pieConfig = {
    appendPadding: 10,
    data: trafficData.filter((item) => item.value > 0),
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    height: 300,
    scale: {
      color: {
        range: ["#1e2d7d","#10274a", "#009973", "#00b189"],
      },
    },
    label: {
      text: (d) => `${d.type}\n${d.value} GB`,
      position: "spider",
      style: {
        fontSize: 14,
        fontWeight: 500,
        fill: "#333",
      },
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
    tooltip: {
      formatter: (datum) => ({
        name: datum?.type || "User",
        value: `${datum?.value ?? 0} GB`,
      }),
    },
    interactions: [{ type: "element-active" }],
  };

  if (loading) {
    return (
      <div className="smartproxy-container">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <div className="smartproxy-container">
      <h1 className="smartproxy-heading">Decodo Dashboard</h1>

      {/* Subscription Info Section */}
      <Row gutter={24} className="smartproxy-section">
        {subscriptionData && (
          <Col xs={24} md={12}>
            <Card className="smartproxy-card">
              <div className="smartproxy-card-header">
                <img
                  src={Insights}
                  alt="Subscription Icon"
                  className="smartproxy-icon"
                />
                <h2>Subscription Info</h2>
              </div>
              <p>
                <strong>Traffic Limit:</strong> {subscriptionData.traffic_limit}{" "}
                GB
              </p>
              <p>
                <strong>Traffic Used:</strong> {subscriptionData.traffic} GB
              </p>
              <p>
                <strong>Valid From:</strong> {subscriptionData.valid_from}
              </p>
              <p>
                <strong>Valid Until:</strong> {subscriptionData.valid_until}
              </p>
            </Card>
          </Col>
        )}
      </Row>

      {/* Whitelisted IPs */}
      <div className="smartproxy-section">
        <div className="smartproxy-card-header">
          <img
            src={ProxyPng}
            alt="Whitelist Icon"
            className="smartproxy-icon"
          />
          <h2>Whitelisted IPs</h2>
        </div>
        <Button
          className="addnewapi"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
          style={{ marginBottom: "16px" }}
        >
          Add New IP
        </Button>

        <Row gutter={16}>
          {whitelistIPs.map((ip) => (
            <Col xs={24} md={12} lg={8} key={ip.id}>
              <Card className="smartproxy-card">
                <p>
                  <strong>{ip.ip}</strong> {ip.tag && `(${ip.tag})`}
                </p>
                <small>Added on: {ip.created_at}</small>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteIP(ip.id)}
                >
                  Delete
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Sub Users Section */}
      <div className="smartproxy-section">
        <div className="smartproxy-card-header">
          <img src={TeamAdmin} alt="Users Icon" className="smartproxy-icon" />
          <h2>Sub Users</h2>
        </div>

        <Row gutter={16}>
          {subUsers.map((user) => (
            <Col xs={24} md={12} lg={8} key={user.id}>
              <Card className="smartproxy-card">
                <p>
                  <strong>Username:</strong> {user.username}
                </p>
                <p>
                  <strong>Status:</strong> {user.status}
                </p>
                <p>
                  <strong>Traffic Used:</strong> {user.traffic} GB
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Donut Chart Section */}
      <div className="smartproxy-section">
        <div className="smartproxy-card-header">
          <img src={ChartUp} alt="Traffic Icon" className="smartproxy-icon" />
          <h2>Sub Users Traffic Usage</h2>
        </div>

        {trafficData.length > 0 ? (
          <Pie {...pieConfig} />
        ) : (
          <Spin tip="Loading Chart..." />
        )}
      </div>

      {/* Modal for adding IP */}
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
