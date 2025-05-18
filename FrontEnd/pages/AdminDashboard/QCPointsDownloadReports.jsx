import { useState } from "react";
import {
  Card,
  Row,
  Col,
  DatePicker,
  Button,
  message,
  Divider,
  Table,
} from "antd";
import moment from "moment";
import API from "../../utils/BaseURL";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";

const QCPointsDownloadReports = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [qcData, setQcData] = useState([]);

  const columns = [
    { title: "Sr No", dataIndex: "srNo", key: "srNo" },
    { title: "Agent Name", dataIndex: "name", key: "name" },
    { title: "Total Points", dataIndex: "totalPoints", key: "totalPoints" },
  ];

  const fetchData = async () => {
    if (!selectedMonth) return message.warning("Please select a month!");

    try {
      const res = await API.get("/qcpoints/monthly-summary", {
        params: {
          year: selectedMonth.year(),
          month: selectedMonth.format("MM"),
        },
      });

      const formatted = res.data.summary.map((item, index) => ({
        srNo: index + 1,
        name: item.name,
        avatar: item.avatar,
        totalPoints: item.totalPoints,
      }));

      setQcData(formatted);
      message.success("Monthly QC data loaded!");
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch data.");
    }
  };

  const downloadCSV = () => {
    if (!qcData.length) return message.warning("No data to export!");

    const header = ["Sr No", "Agent Name", "Total Points"];
    const rows = qcData.map((d) => [d.srNo, d.name, d.totalPoints]);

    const csvContent =
      [header, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      `QCPoints-Summary-${selectedMonth?.format("YYYY-MM")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Download Monthly QC Points Summary</h2>
      <br />
      <Card style={{ marginBottom: 20 }}>
        <Divider orientation="left">
          <SearchOutlined /> Select Month
        </Divider>
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <DatePicker
              picker="month"
              style={{ width: "100%" }}
              placeholder="Select Month"
              onChange={(val) => setSelectedMonth(val)}
              value={selectedMonth}
              format="YYYY-MM"
            />
          </Col>
          <Col xs={24} sm={8}>
            <Button type="primary" onClick={fetchData}>
              Submit
            </Button>
            <Button
              type="dashed"
              icon={<DownloadOutlined />}
              style={{ marginLeft: 10 }}
              onClick={downloadCSV}
              disabled={!qcData.length}
            >
              Download CSV
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={qcData}
          rowKey="name"
          pagination={{ pageSize: 50 }}
        />
      </Card>
    </div>
  );
};

export default QCPointsDownloadReports;
