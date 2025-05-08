import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Input,
  Button,
  Select,
  DatePicker,
  message,
} from "antd";
import moment from "moment";
import { DownloadOutlined } from "@ant-design/icons";
import API from "../../utils/BaseURL";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { EnvironmentOutlined } from "@ant-design/icons";
import MainLogo from "../../src/assets/mainlogo.png";
import FooterImage from "../../src/assets/footerImage.png";
import "../../styles/DownloadSalaryWokers.css";
const { Option } = Select;

const DownloadSalaryWokers = () => {
  const [filters, setFilters] = useState({
    shift: "",
    agentType: "",
    month: moment(),
  });
  const [formValues, setFormValues] = useState({
    date: moment(),
    bankName: "",
    sheetName: "",
  });

  const [filteredData, setFilteredData] = useState([]);

  const columns = [
    { title: "Sr No", dataIndex: "srNo", key: "srNo" },
    { title: "Bank", dataIndex: "bank", key: "bank" },
    { title: "Account Title", dataIndex: "accountTitle", key: "accountTitle" },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      render: (val) => `Rs ${val}`,
    },
  ];

  const handleSubmit = async () => {
    try {
      const res = await API.get(`/downloadslarayreport/download-sheet`, {
        params: {
          shift: filters.shift,
          agentType: filters.agentType,
          year: filters.month.format("YYYY"),
          month: filters.month.format("MM"),
        },
      });

      setFilteredData(res.data);
      message.success("Data filtered successfully!");
    } catch (error) {
      console.error("Error fetching salary sheet:", error);
      message.error("Failed to fetch salary data!");
    }
  };

  const handleDownload = () => {
    if (filteredData.length === 0) {
      message.warning("No data available to download.");
      return;
    }
  
    const doc = new jsPDF();
       
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const entriesPerPage = 25;
    let currentPage = 1;
    let startY = 70;
    let totalSalary = 0;
  
    // Function to render the header on each page
    const renderHeader = () => {
      doc.addImage(MainLogo, "PNG", 10, 5, 30, 30);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("CONNECT PVT. LTD", 45, 20);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Digital World of Tech", 45, 28);
      doc.text(`Date: ${new Date().toISOString().split("T")[0]}`, 160, 20);
  
      // "To" Section
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("To:", 14, 50);
      doc.text("The Manager", 14, 55);
      doc.text(`${formValues.bankName || "Your Bank Name"} Bank`, 14, 60);
    };
  
    // Function to render footer on each page
    const renderFooter = () => {
      const adjustedFooterY = pageHeight - 25;
      doc.setFontSize(10);
      doc.setTextColor(0, 180, 255);
      doc.setFont("helvetica", "bold");
      doc.text("HEAD OFFICE", 14, adjustedFooterY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text("Munir plaza, Lower Ground of silk bank", 14, adjustedFooterY + 5);
      doc.text("Next to D-Watson Chandni Chowk, Rawalpindi.", 14, adjustedFooterY + 10);
  
      doc.setTextColor(0, 180, 255);
      doc.setFont("helvetica", "bold");
      doc.text("BRANCH OFFICE", pageWidth / 2 + 10, adjustedFooterY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text("Ground Floor Building No. 146, Block C,", pageWidth / 2 + 10, adjustedFooterY + 5);
      doc.text("Main Civic Center, Phase-4, Bahria Town,", pageWidth / 2 + 10, adjustedFooterY + 10);
      doc.text("Rawalpindi.", pageWidth / 2 + 10, adjustedFooterY + 15);
      doc.addImage(FooterImage, "PNG", 0, pageHeight - 10, pageWidth, 10);
    };
  
    // Split data into pages
    for (let i = 0; i < filteredData.length; i += entriesPerPage) {
      if (currentPage > 1) {
        doc.addPage();
        startY = 50; // Adjusted for new page header
        renderHeader();
      } else {
        renderHeader();
      }
  
      const pageData = filteredData.slice(i, i + entriesPerPage);
      const tableData = pageData.map((item, index) => {
        totalSalary += item.salary;
        return [
          index + 1 + i,
          item.bank,
          item.branch || "N/A",
          item.accountTitle,
          item.accountNumber,
          `Rs ${item.salary}`,
        ];
      });
  
      // If this is the last page, add the Total row
      if (i + entriesPerPage >= filteredData.length) {
        tableData.push([
          { content: "Total", colSpan: 5, styles: { fontStyle: "bold", halign: "right" } },
          { content: `Rs ${totalSalary}`, styles: { fontStyle: "bold", halign: "right" } }
        ]);
      }
  
      autoTable(doc, {
        startY,
        head: [
          [
            {
              content: `HACKTA CONNECT Pvt Ltd. SALARY SHEET - ${formValues.sheetName || "Management March-2025"}`,
              colSpan: 6,
              styles: {
                fontSize: 10,
                fontStyle: "bold",
                halign: "center",
                textColor: [0, 0, 0],
              },
            },
          ],
          ["Sr No", "Bank", "Branch", "Account Title", "Account Number", "Salary"],
        ],
        body: tableData,
        theme: "grid",
        styles: {
          fontSize: 9,
          font: "helvetica",
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.2,
          cellPadding: 2,
          fillColor: null,
          valign: "middle",
          halign: "center",
        },
        margin: { bottom: 30 }, // Ensure footer doesn't overlap
      });
  
      renderFooter();
      currentPage++;
    }
  
    // Save PDF file
    const fileName = formValues.sheetName
      ? `${formValues.sheetName}.pdf`
      : "SalarySheet.pdf";
    doc.save(fileName);
  };
  
  
  
  
  
  
  return (
    <div className="download-salary-container">
      <h1 className="download-salary-title">Download Salary Sheet - Workers</h1>
      <Card className="download-salary-card">
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <label>Date</label>
            <DatePicker
              value={formValues.date}
              onChange={(val) => setFormValues({ ...formValues, date: val })}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <label>Bank Name</label>
            <Input
              value={formValues.bankName}
              onChange={(e) =>
                setFormValues({ ...formValues, bankName: e.target.value })
              }
              placeholder="Enter Bank Name"
            />
          </Col>
          <Col xs={24} sm={8}>
            <label>Sheet Name</label>
            <Input
              value={formValues.sheetName}
              onChange={(e) =>
                setFormValues({ ...formValues, sheetName: e.target.value })
              }
              placeholder="e.g. Management March-2025"
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col xs={24} sm={8}>
            <label>Shift</label>
            <Select
              value={filters.shift}
              onChange={(value) => setFilters({ ...filters, shift: value })}
              placeholder="Select Shift"
              allowClear
              style={{ width: "100%" }}
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
              onChange={(value) =>
                setFilters({ ...filters, agentType: value })
              }
              placeholder="Select Agent Type"
              allowClear
              style={{ width: "100%" }}
            >
              <Option value="Office Agent">Office Agent</Option>
              <Option value="WFH Agent">WFH Agent</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <label>Month</label>
            <DatePicker
              picker="month"
              value={filters.month}
              onChange={(val) => setFilters({ ...filters, month: val })}
              style={{ width: "100%" }}
            />
          </Col>
        </Row>

        <div className="download-button-wrapper">
          <Button type="default" onClick={handleSubmit} style={{ marginRight: 10, color: "white" }}>
            Submit
          </Button>
          <Button
            type="primary"
            shape="round"
            style={{ color: "white" }}
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            disabled={filteredData.length === 0}
          >
            Download Report
          </Button>
        </div>
      </Card>

      <Card className="download-salary-table">
        <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 6 }} />
      </Card>
    </div>
  );
};

export default DownloadSalaryWokers;
