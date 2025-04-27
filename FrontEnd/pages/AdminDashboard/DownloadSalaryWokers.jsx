import React, { useState, useEffect } from "react";
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
import { saveAs } from "file-saver";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import API from "../../utils/BaseURL";

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

  const handleDownload = async () => {
    try {
      const url = "/SalaryTemplate.pdf";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch PDF template.");
      const existingPdfBytes = await response.arrayBuffer();

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const existingPages = pdfDoc.getPages();
      const hasTemplatePage = existingPages.length > 0;
      const templatePage = hasTemplatePage
        ? existingPages[0]
        : pdfDoc.addPage();
      const templateSize = templatePage.getSize();
      const { width, height } = templateSize;

      const [templateBackground] = await pdfDoc.embedPages([templatePage]);
      if (hasTemplatePage) pdfDoc.removePage(0);

      const itemsPerPage = 25;
      const pagesRequired = Math.ceil(filteredData.length / itemsPerPage);
      let totalSalary = 0;
      const currentDate = new Date().toLocaleDateString("en-GB");

      for (let i = 0; i < pagesRequired; i++) {
        const page = pdfDoc.addPage([width, height]);
        page.drawPage(templateBackground);

        let cursorY = height - 100;

        // ---------------- HEADER ----------------
        if (i === 0) {
          page.drawText("To,", { x: 50, y: cursorY, size: 12, font });
          cursorY -= 18;
          page.drawText("Manager", { x: 50, y: cursorY, size: 12, font });
          cursorY -= 18;
          page.drawText(`Bank Name: ${formValues.bankName}`, {
            x: 50,
            y: cursorY,
            size: 12,
            font,
          });
          page.drawText(`Date: ${currentDate}`, {
            x: width - 150,
            y: height - 60,
            size: 12,
            font,
          });
          cursorY -= 35;
        }

        // --------------- TABLE CONFIG ----------------
        const headers = [
          "Sr No",
          "Bank",
          "Account Title",
          "Account No",
          "Salary",
        ];
        const colWidths = [50, 100, 150, 180, 100];
        const colX = [50, 100, 200, 350, 480];
        const rowHeight = 22;
        const tableTop = cursorY;
        let y = tableTop;

        // ------------ TITLE HEADER ROW (SPANNED) ------------
        const fullTitle = `HACTA CONNECT PVT LTD Salary Sheet - ${
          formValues.sheetName || "Unnamed"
        }`;
        page.drawText(fullTitle, {
          x: colX[0] + 10,
          y: y + 5,
          size: 11,
          font: boldFont,
        });
        y -= rowHeight;

        // ------------ COLUMN HEADERS ------------
        headers.forEach((text, idx) => {
          page.drawText(text, {
            x: colX[idx] + 5,
            y: y + 5,
            size: 10,
            font: boldFont,
          });
        });
        y -= rowHeight;

        // ------------ DATA ROWS ------------
        const dataSlice = filteredData.slice(
          i * itemsPerPage,
          (i + 1) * itemsPerPage
        );
        dataSlice.forEach((item) => {
          const values = [
            `${item.srNo}`,
            item.bank,
            item.accountTitle,
            item.accountNumber,
            `Rs ${item.salary}`,
          ];
          values.forEach((text, idx) => {
            page.drawText(text, {
              x: colX[idx] + 5,
              y: y + 5,
              size: 10,
              font,
            });
          });
          totalSalary += item.salary;
          y -= rowHeight;
        });

        const isLastPage = i === pagesRequired - 1;

        // ------------ TOTAL SALARY ROW ------------
        if (isLastPage) {
          const values = ["", "", "", "Total Salary:", `Rs ${totalSalary}`];
          values.forEach((text, idx) => {
            page.drawText(text, {
              x: colX[idx] + 5,
              y: y + 5,
              size: 10,
              font: boldFont,
            });
          });
          y -= rowHeight;
        }

        // ------------ TABLE BORDERS (CLEAN) ------------
        const totalRows = dataSlice.length + 2 + (isLastPage ? 1 : 0); // title + header + total
        const totalCols = headers.length;

        for (let r = 0; r <= totalRows; r++) {
          const lineY = tableTop - r * rowHeight - 5;
          page.drawLine({
            start: { x: colX[0], y: lineY },
            end: {
              x: colX[totalCols - 1] + colWidths[totalCols - 1],
              y: lineY,
            },
            thickness: 1.2,
            color: rgb(0.2, 0.2, 0.2),
          });
        }

        for (let c = 0; c <= totalCols; c++) {
          const x = c === totalCols ? colX[c - 1] + colWidths[c - 1] : colX[c];
          page.drawLine({
            start: { x, y: tableTop + 15 },
            end: { x, y: y + rowHeight + 5 },
            thickness: 1.2,
            color: rgb(0.2, 0.2, 0.2),
          });
        }

        // ------------ CEO Signature (First Page) ------------
        if (i === 0) {
          page.drawText("CEO: Awais Ahmad", {
            x: width - 200,
            y: y - 40,
            size: 12,
            font: boldFont,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, `${formValues.sheetName || "SalarySheet"}.pdf`);
    } catch (err) {
      console.error("PDF Generation Failed:", err);
      message.error("Could not generate the PDF. Please check the console.");
    }
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
              onChange={(value) => setFilters({ ...filters, agentType: value })}
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
            disabled={filteredData.length === 0} // 👈 disable if no data
          >
            Download Report
          </Button>
        </div>
      </Card>

      <Card className="download-salary-table">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 6 }}
        />
      </Card>
    </div>
  );
};

export default DownloadSalaryWokers;
