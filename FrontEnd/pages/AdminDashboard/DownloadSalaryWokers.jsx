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
  Divider,
} from "antd";
import moment from "moment";
import {
  BankOutlined,
  CalendarOutlined,
  DownloadOutlined,
  FireOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import API from "../../utils/BaseURL";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { EnvironmentOutlined } from "@ant-design/icons";
import MainLogo from "../../src/assets/mainlogo.png";
import HeaderImage from "../../src/assets/headerImage.png";
import FooterImage from "../../src/assets/footerImage.png";
import "../../styles/DownloadSalaryWokers.css";
import { Calendar } from "primereact/calendar";
const { Option } = Select;
const { MonthPicker } = DatePicker;

const DownloadSalaryWokers = () => {
  const [filters, setFilters] = useState({
    shift: "",
    agentType: "",
    month: moment().startOf("month"), // Default to the current month
  });
  const [formValues, setFormValues] = useState({
    date: moment(),
    bankName: "",
    sheetName: "",
  });

  const [filteredData, setFilteredData] = useState([]);
  // Function to handle month selection and extract year and month
  const handmymycage = (date, dateString) => {
    if (date) {
      const selectedDate = moment(date); // Convert to moment object
      const year = selectedDate.year(); // Extract year
      const month = selectedDate.format("MM"); // Extract month in two-digit format

      console.log("Selected Date:", dateString);
      console.log("Year:", year);
      console.log("Month:", month);

      // Update filters with extracted year and month
      setFilters({
        ...filters,
        year: year,
        month: month,
      });
    } else {
      console.log("No date selected.");
    }
  };

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
          year: filters.year, // Use extracted year
          month: filters.month, // Use extracted month
          branch: filters.branch, // ✅ Added
          hasBankAccount: filters.hasBankAccount, // ✅ Added
        },
      });

      setFilteredData(res.data);
      message.success("Data filtered successfully!");
    } catch (error) {
      console.error("Error fetching salary sheet:", error);
      message.error("Failed to fetch salary data!");
    }
  };

  // Updated handleDownload function
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
    let sheetNo = 1; // ✅ Initialize sheet number
    let totalSalary = 0;

    // Function to render the header on each page
    const renderHeader = () => {
      // Displaying the Header Image at the Absolute Top (0, 0)
      doc.addImage(HeaderImage, "PNG", 0, 0, pageWidth, 7); // Full width, 10px height
      doc.addImage(MainLogo, "PNG", 10, 15, 18, 18);
      // HACKTA Text (Uppercase, Bold, Larger Font Size)
      doc.setFontSize(18); // Increased Font Size
      doc.setFont("helvetica", "bold"); // Bold Font Style
      doc.setTextColor(50, 50, 50); // Dark Gray color (similar to the image)
      doc.text("HACKTA", 30, 24); // Text in uppercase

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("CONNECT PVT. LTD", 30, 29);
      doc.text(`Date: ${new Date().toISOString().split("T")[0]}`, 160, 24);

      // "To" Section
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("To:", 14, 50);
      doc.text("The Manager", 14, 55);
      doc.text(`${formValues.bankName || "Your Bank Name"} Bank`, 14, 60);
    };

    // Function to render footer on each page
    const renderFooter = () => {
      const adjustedFooterY = pageHeight - 20;

      // Displaying CEO Text on Two Separate Lines
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0); // Black color

      // First Line (CEO:)
      doc.text("CEO:", 160, pageHeight - 40);

      // Second Line (Awais Ahmad)
      doc.setFont("helvetica", "normal");
      doc.text("Awais Ahmad", 160, pageHeight - 36);

      // HEAD OFFICE (Bold and Adjusted)
      doc.setFont("helvetica", "bold"); // Bold Font Style
      doc.setFontSize(8);
      doc.setTextColor(29, 45, 92); // Updated text color (dark blue) for heading
      doc.text("HEAD OFFICE", 14, adjustedFooterY);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(29, 45, 92); // Lighter Blue Text Color for heading
      doc.text(
        "Munir plaza, Lower Ground of silk bank",
        14,
        adjustedFooterY + 4
      );
      doc.text("Next to D-Watson Chandni Chowk,", 14, adjustedFooterY + 8);
      doc.text("Rawalpindi.", 14, adjustedFooterY + 12);

      // BRANCH OFFICE (Right - Further Reduced Gap)
      doc.setFont("helvetica", "bold");
      doc.setTextColor(29, 45, 92); // Updated text color (dark blue) for heading

      // Further reduced the horizontal gap by adjusting the X position
      doc.text("BRANCH OFFICE", pageWidth / 2 - 30, adjustedFooterY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(29, 45, 92); // Lighter Blue Text Color for heading
      doc.text(
        "Ground Floor Building No. 146, Block C,",
        pageWidth / 2 - 30,
        adjustedFooterY + 4
      );
      doc.text(
        "Main Civic Center, Phase-4, Bahria Town,",
        pageWidth / 2 - 30,
        adjustedFooterY + 8
      );
      doc.text("Rawalpindi.", pageWidth / 2 - 30, adjustedFooterY + 12);

      // ✅ Footer Image (if any)
      doc.addImage(FooterImage, "PNG", 0, pageHeight - 10, pageWidth, 10);
    };

    // Function to render the watermark on every page
    const renderWatermark = () => {
      doc.setGState(new doc.GState({ opacity: 0.08 })); // Reduced opacity for watermark
      doc.addImage(
        MainLogo,
        "PNG",
        pageWidth / 2 - 50, // Center horizontally
        pageHeight / 2 - 50, // Center vertically
        100, // ✅ Reduced width
        100 // ✅ Reduced height
      );
      doc.setGState(new doc.GState({ opacity: 1 })); // Reset opacity for text
    };

    // Split data into pages
    for (let i = 0; i < filteredData.length; i += entriesPerPage) {
      if (currentPage > 1) {
        doc.addPage();
        startY = 90;
        renderHeader();
        renderWatermark(); // Add watermark on each new page
      } else {
        renderHeader();
        renderWatermark();
      }

      const pageData = filteredData.slice(i, i + entriesPerPage);
      const tableData = pageData.map((item, index) => {
        totalSalary += item.salary;
        return [
          index + 1 + i,
          item.bank,
          item.accountTitle,
          item.accountNumber,
          `Rs ${item.salary}`,
        ];
      });

      // If this is the last page, add the Total row
      if (i + entriesPerPage >= filteredData.length) {
        tableData.push([
          {
            content: "Total",
            colSpan: 5,
            styles: { fontStyle: "bold", halign: "right" },
          },
          {
            content: `Rs ${totalSalary}`,
            styles: { fontStyle: "bold", halign: "right" },
          },
        ]);
      }

      autoTable(doc, {
        startY,
        head: [
          [
            {
              content: `HACKTA CONNECT Pvt Ltd. SALARY SHEET - ${
                formValues.sheetName || "Management March-2025"
              } (# No: ${sheetNo})`,
              colSpan: 6,
              styles: {
                fontSize: 10,
                fontStyle: "bold",
                halign: "center",
                textColor: [0, 0, 0],
              },
            },
          ],
          [
            { content: "Sr No", styles: { halign: "left" } },
            { content: "Bank", styles: { halign: "left" } },
            { content: "Account Title", styles: { halign: "left" } },
            { content: "Account Number", styles: { halign: "left" } },
            { content: "Salary", styles: { halign: "left" } },
          ],
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
          halign: "left",
        },
        margin: { bottom: 30 },
      });

      renderFooter();
      currentPage++;
      sheetNo++; // ✅ Increase sheet number for the next page
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
        {/* ✅ Filter Section */}
        <Divider
          orientation="left"
          plain
          style={{ fontSize: "16px", fontWeight: "bold" }}
        >
          <SearchOutlined /> Filters
        </Divider>
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <label>Branch (A=CM , B=Bahria)</label>
            <Select
              value={filters.branch}
              onChange={(value) => setFilters({ ...filters, branch: value })}
              placeholder="Select Branch"
              allowClear
              style={{ width: "100%" }}
            >
              <Option value="Branch A">Branch A</Option>
              <Option value="Branch B">Branch B</Option>
            </Select>
          </Col>
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
              onChange={(value) => setFilters({ ...filters, agentType: value })}
              placeholder="Select Agent Type"
              allowClear
              style={{ width: "100%" }}
            >
              <Option value="Office Agent">Office Agent</Option>
              <Option value="WFH Agent">WFH Agent</Option>
            </Select>
          </Col>
        </Row>

        {/* ✅ Bank Details Section */}
        <Divider
          orientation="left"
          plain
          style={{ fontSize: "16px", fontWeight: "bold" }}
        >
          <BankOutlined /> Bank Details
        </Divider>
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <label>Sheet Date</label>
            <DatePicker
              value={formValues.date}
              onChange={(val) => setFormValues({ ...formValues, date: val })}
              style={{ width: "100%" }}
              a
              inputReadOnly
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

        {/* ✅ Additional Filters Section */}
        <Divider
          orientation="left"
          plain
          style={{ fontSize: "16px", fontWeight: "bold" }}
        >
          <CalendarOutlined /> Date & Account Status
        </Divider>
        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col xs={24} sm={8}>
            <label>Month</label>
            <Calendar
              view="month"
              dateFormat="yy-mm"
              showIcon
              value={
                filters.year && filters.month
                  ? new Date(`${filters.year}-${filters.month}-01`)
                  : null
              }
              onChange={(e) => {
                const date = new Date(e.value);
                const year = date.getFullYear().toString();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                setFilters((prev) => ({
                  ...prev,
                  year,
                  month,
                }));
              }}
              style={{
                width: "100%",
                padding: "0",
                borderRadius: "4px",
              }}
              className="custom-month-filter"
            />
          </Col>
          <Col xs={24} sm={8}>
            <label>Bank Account Status</label>
            <Select
              value={filters.hasBankAccount}
              onChange={(value) =>
                setFilters({ ...filters, hasBankAccount: value })
              }
              placeholder="Select Bank Account Status"
              allowClear
              style={{ width: "100%" }}
            >
              <Option value="true">Has Bank Account</Option>
              <Option value="false">No Bank Account</Option>
            </Select>
          </Col>
        </Row>

        {/* ✅ Submit & Download Buttons */}
        <Divider
          orientation="left"
          plain
          style={{ fontSize: "16px", fontWeight: "bold" }}
        >
          <FireOutlined /> Actions
        </Divider>
        <div className="download-button-wrapper">
          <Button
            type="default"
            onClick={handleSubmit}
            style={{ marginRight: 10, color: "white" }}
          >
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
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 50 }}
          scroll={{ x: "max-content" }} // ✅ Enables horizontal scroll
        />
      </Card>
    </div>
  );
};

export default DownloadSalaryWokers;
