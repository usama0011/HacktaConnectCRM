import React, { useEffect, useState } from "react";
import { Card, Row, Col, Skeleton, Typography, Divider } from "antd";
import { Calendar } from "primereact/calendar";
import "../../styles/UploadSalaryRecord.css";
import API from "../../utils/BaseURL";
import { Column } from "@ant-design/plots"; // ✅ New import for chart
import { DualAxes } from "@ant-design/plots";

const { Title } = Typography;

const shifts = ["Morning", "Evening", "Night"];
const branches = ["Branch A", "Branch B"];
const agentTypes = ["Office Agent", "WFH Agent"];

const UploadSalaryRecord = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const [filters, setFilters] = useState({
    month: currentMonth,
    year: currentYear,
  });
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState([]);

  const fetchSummary = async () => {
    if (!filters.month || !filters.year) return;
    setLoading(true);
    try {
      const res = await API.get(
        `/salary/branch-monthly-salary-summary?month=${filters.month}&year=${filters.year}`
      );
      setSummary(res.data.report || []);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSummary();
  }, [filters]);

  // ✅ Prepare chart data
  const branchCostData = [];
  const branchMap = {};
  summary.forEach((item) => {
    if (["Branch A", "Branch B"].includes(item.branch)) {
      if (!branchMap[item.branch]) {
        branchMap[item.branch] = 0;
      }
      branchMap[item.branch] += parseFloat(item.cost) || 0;
    }
  });

  for (const branch in branchMap) {
    branchCostData.push({
      branch,
      cost: branchMap[branch],
    });
  }

// Prepare data for the dual axes chart

// Step 1 - Prepare stacked bar data per shift
const uvBillData = [];

branches.forEach((branch) => {
  shifts.forEach((shift) => {
    // sum costs for all agent types for this shift
    const cost = summary
      .filter(
        (item) =>
          item.branch === branch &&
          item.shift === shift
      )
      .reduce((sum, item) => sum + parseFloat(item.cost || 0), 0);

    uvBillData.push({
      time: branch,
      value: cost,
      type: shift,
    });
  });
});

// Step 2 - Prepare line data for total cost
const transformData = [];

branches.forEach((branch) => {
  const totalCost = uvBillData
    .filter((d) => d.time === branch)
    .reduce((sum, d) => sum + d.value, 0);

  transformData.push({
    time: branch,
    count: totalCost,
  });
});

const dualAxesConfig = {
  xField: "time",
  legend: true,
  children: [
    {
      data: uvBillData,
      type: "interval",
      yField: "value",
      stack: true,
      colorField: "type",
      style: { maxWidth: 80 },
      interaction: { elementHighlight: { background: true } },
    },
    {
      data: transformData,
      type: "line",
      yField: "count",
      style: { lineWidth: 2, stroke: "#FE911E" },
    },
  ],
};



  return (
    <div className="upload-salary-container">
      <Title level={3} style={{ marginBottom: 20 }}>
        Monthly Salary Aggregation Summary
      </Title>

      <div className="calendar-wrapper">
        <Calendar
          view="month"
          dateFormat="yy-mm"
          showIcon
          value={new Date(`${filters.year}-${filters.month}-01`)}
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
      </div>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <Col xs={24} sm={12} md={8} key={idx}>
                <Card>
                  <Skeleton active />
                </Card>
              </Col>
            ))
          : branches.map((branch, index) => (
              <React.Fragment key={branch}>
                <Col span={24}>
                  <Divider orientation="left">
                    <Title level={4} style={{ margin: 0 }}>
                      {branch}
                    </Title>
                  </Divider>
                </Col>

                {agentTypes.map((agentType) =>
                  shifts.map((shift) => {
                    const data = summary.find(
                      (item) =>
                        item.branch === branch &&
                        item.agentType === agentType &&
                        item.shift === shift
                    );

                    return (
                      <Col
                        xs={24}
                        sm={12}
                        md={8}
                        key={`${branch}-${agentType}-${shift}`}
                      >
                        <Card hoverable>
                          <p>
                            <strong style={{ color: "#1e2d82" }}>Shift:</strong>{" "}
                            {shift}
                          </p>
                          <p>
                            <strong style={{ color: "#1e2d82" }}>
                              Agent Type:
                            </strong>{" "}
                            {agentType}
                          </p>
                          <p>
                            <strong style={{ color: "#1e2d82" }}>
                              Sessions:
                            </strong>{" "}
                            {data?.totalSessions || 0}
                          </p>
                          <p>
                            <strong style={{ color: "#1e2d82" }}>
                              Clicks:
                            </strong>{" "}
                            {data?.totalClicks || 0}
                          </p>
                          <p>
                            <strong style={{ color: "#1e2d82" }}>
                              Total IPs:
                            </strong>{" "}
                            {data?.totalIPs || 0}
                          </p>
                          <p>
                            <strong style={{ color: "#1e2d82" }}>Cost:</strong>{" "}
                            Rs {data?.cost || 0}
                          </p>
                        </Card>
                      </Col>
                    );
                  })
                )}
              </React.Fragment>
            ))}
      </Row>
      {/* 📊 Salary Cost Bar Chart by Branch */}
      <div style={{ marginTop: 50 }}>
        <Divider orientation="center">
          <Title level={4}>Branch-wise Total Salary Cost (Rs)</Title>
        </Divider>
         <DualAxes {...dualAxesConfig} />

      </div>
    </div>
  );
};

export default UploadSalaryRecord;
