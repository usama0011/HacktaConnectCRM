import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // or any other theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

// Import Layouts

// Import Admin Pages
import AdminDashboard from "../pages/AdminDashboard/index.jsx";
import AdminAnalytics from "../pages/AdminDashboard/AdminAnalytics.jsx";
import Announcements from "../pages/AdminDashboard/Announcements.jsx";
import AttendanceManagement from "../pages/AdminDashboard/AttandanceManagement.jsx";
import CalendarManagement from "../pages/AdminDashboard/CalendarManagement.jsx";
import HelpCenterManagement from "../pages/AdminDashboard/HelpCenterManagement.jsx";
import HelpCenter from "../pages/userDashobard/HelpCenter.jsx";
import ManagerUsers from "../pages/AdminDashboard/ManagerUsers.jsx";
import NoticeBoardCreation from "../pages/AdminDashboard/NoticeBoardCreation.jsx";
import NotificationsCreation from "../pages/AdminDashboard/NotificationsCreation.jsx";
import PerformanceMetrics from "../pages/AdminDashboard/PerformanceMetrics.jsx";
import ProxyUsage from "../pages/AdminDashboard/ProxyUsage.jsx";
import Reporting from "../pages/AdminDashboard/Reporting.jsx";
import ReportsGenerate from "../pages/AdminDashboard/ReportsGenerate.jsx";
import SalaryManagement from "../pages/AdminDashboard/SalaryManagemet.jsx";
import SettingsAdmin from "../pages/AdminDashboard/SettingsAdmin.jsx";
import TermsAndPolicies from "../pages/AdminDashboard/TermsAndPolicies.jsx";
import ViewSingleSalaryStatement from "../pages/AdminDashboard/ViewSingleSalaryStatement.jsx";

// Import General Pages
import Login from "../pages/generalPages/Login.jsx";
import Signup from "../pages/generalPages/Signup.jsx";

// Import User Dashboard Pages
import MyProfile from "../pages/userDashobard/MyProfile.jsx";
import MyRecord from "../pages/userDashobard/MyRecord.jsx";
import NoticeCalendar from "../pages/userDashobard/NoticeCalendar.jsx";
import Notifications from "../pages/userDashobard/Notifications.jsx";
import Pattern from "../pages/userDashobard/Pattern.jsx";
import Settings from "../pages/userDashobard/Settings.jsx";
import TermsAndPoliciesUser from "../pages/userDashobard/TermsAndPolicies.jsx";
import UploadWork from "../pages/userDashobard/UploadWork.jsx";
import UserTasks from "../pages/userDashobard/UserTasks.jsx";

// User Context for Authentication
import { UserProvider, useUserContext } from "../context/UserContext.jsx";
import UserDashboard from "../pages/userDashobard/index.jsx";
import { OverView } from "../pages/AdminDashboard/OverView.jsx";
import AdminLayout from "../components/AdminLayout.jsx";
import AddNewUser from "../pages/AdminDashboard/AddNewUser.jsx";
import UserLayout from "../components/UserLayout.jsx";
import Faqs from "../pages/userDashobard/Faqs.jsx";
import UserTaskCreation from "../pages/AdminDashboard/UserTaskCreation.jsx";
import ViewSingleTask from "../pages/userDashobard/ViewSingleTask.jsx";
import QCPoints from "../pages/AdminDashboard/QCPoints.jsx";
import AllUsersQCPoints from "../pages/AdminDashboard/AllUsersQCPoints.jsx";
import SingleUserQCPoints from "../pages/AdminDashboard/SingleUserQCPoints.jsx";
import AllUsersIPReport from "../pages/AdminDashboard/AllUsersIPReport.jsx";
import SingleUserIPReport from "../pages/AdminDashboard/SingleUserIPReport.jsx";
import AllUsersAttendance from "../pages/AdminDashboard/AllUsersAttendance.jsx";
import SingleUserAttendance from "../pages/AdminDashboard/SingleUserAttendance.jsx";
import SmartProxy from "../pages/AdminDashboard/SmartProxy.jsx";
import MangoProxy from "../pages/AdminDashboard/MangoProxy.jsx";
import ProxyGeo from "../pages/AdminDashboard/ProxyGeo.jsx";
import ViewUserTaskCreations from "../pages/AdminDashboard/ViewUserTaskCreations.jsx";
import SingleTaskItem from "../pages/AdminDashboard/SingleTaskItem.jsx";
import AgentsSalaryRecord from "../pages/AdminDashboard/CreateRestEmployesSalary.jsx";
import SalaryFormulaForm from "../pages/AdminDashboard/SalaryFormulaForm.jsx";
import AttandanceManagementtAdmin from "../pages/AdminDashboard/AttandanceManagementt.jsx";
import AgentDailyIPReports from "../pages/AdminDashboard/AgentDailyIPReports.jsx";
import OfficeAgentsSalaryFormula from "../pages/AdminDashboard/OfficeAgentsSalaryFormula.jsx";
import WFHSalaryFormula from "../pages/AdminDashboard/WFHSalaryFormula.jsx";
import AgentSalaryAggrigation from "../pages/AdminDashboard/CreateAgentsSalary.jsx";
import DownloadSalaryReports from "../pages/AdminDashboard/DownloadSalaryReports.jsx";
import AttandanceDownloadReports from "../pages/AdminDashboard/AttandanceDownloadReports.jsx";
import QCPointsDownloadReports from "../pages/AdminDashboard/QCPointsDownloadReports.jsx";
import RegisteredUsersDownlaodReports from "../pages/AdminDashboard/RegisteredUsersDownlaodReports.jsx";
import AgentsIPsReportsDownload from "../pages/AdminDashboard/AgentsIPsReportsDownload.jsx";
import ProxyReportsDownlaod from "../pages/AdminDashboard/ProxyReportsDownlaod.jsx";
import DownloadSalaryWokers from "../pages/AdminDashboard/DownloadSalaryWokers.jsx";
import Features from "../pages/generalPages/Features.jsx";
import Company from "../pages/generalPages/Company.jsx";
import GeneralSalaryCaculator from "../pages/AdminDashboard/GeneralSalaryCaculator.jsx";
import AllAgentsRegistraction from "../pages/AdminDashboard/AllAgentsRegistraction.jsx";
import AllManagementRecord from "../pages/AdminDashboard/AllManagementRecord.jsx";
import SingleAgentAttendance from "../pages/AdminDashboard/SingleAgentAttandance.jsx";
import { ConfigProvider } from "antd";
import MangoProxyB from "../pages/AdminDashboard/MangoProxyB.jsx";
import InfaticaAPIDetails from "../pages/AdminDashboard/InfaticaAPIDetails.jsx";
import AboutUs from "../pages/generalPages/AboutUs.jsx";
import AgentsCSVUPload from "../pages/AdminDashboard/AgentsCSVUPload.jsx";
import UploadSalaryRecord from "../pages/AdminDashboard/UploadSalaryRecord.jsx";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useUserContext();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
// Custom theme colors
const primaryColor = "#1e2d7d"; // Base green
const hoverColor = "#1e2d7d"; // Slightly darker for hover

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Inter, sans-serif",
          colorPrimary: "#1e2d7d",
          colorPrimaryHover: "#1e2d7d",
          colorPrimaryActive: "#1e2d7d",
          colorTextLightSolid: "#fff",
        },
        components: {
          Button: {
            colorPrimary: "#1e2d7d",
            colorPrimaryHover: "#172266", // fix: not white
            colorPrimaryActive: "#1e2d7d",
            defaultBg: "#1e2d7d",
            defaultColor: "#fff",
            defaultShadow: "none",
            primaryShadow: "none",
            lineWidth: 0,
            borderRadius: 6,
          },
        },
      }}
    >
      <UserProvider>
        <BrowserRouter>
          <Routes>
            {/* General Routes */}
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/features" element={<Features />} />
            <Route path="/company" element={<TermsAndPoliciesUser />} />
            <Route path="/aboutus" element={<AboutUs />} />

            {/* User Dashboard Grouped Under UserLayout */}
            <Route
              path="/user/dashboard"
              element={
                // <ProtectedRoute allowedRoles={["user"]}>
                <UserLayout />
                // </ProtectedRoute>
              }
            >
              {/* <Route path="helpcenter" element={<HelpCenter />} /> */}
              <Route index element={<UserDashboard />} />
              <Route path="myprofile" element={<MyProfile />} />
              <Route path="faqs" element={<Faqs />} />
              <Route path="myrecord" element={<MyRecord />} />
              <Route
                path="generalsalarycalculator"
                element={<GeneralSalaryCaculator />}
              />
              <Route path="noticecalendar" element={<NoticeCalendar />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="tasks/:taskId" element={<ViewSingleTask />} />
              <Route path="pattern" element={<Pattern />} />
              <Route path="settings" element={<Settings />} />
              <Route
                path="termsandpolicies"
                element={<TermsAndPoliciesUser />}
              />
              <Route path="uploadwork" element={<UploadWork />} />
              <Route path="usertasks" element={<UserTasks />} />
            </Route>

            {/* Admin Dashboard Grouped Under AdminLayout */}
            <Route
              path="/admin/dashboard"
              element={
                // <ProtectedRoute allowedRoles={["admin", "Super Admin"]}>
                <AdminLayout />
                // </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="analytics" element={<AdminAnalytics />} />

              <Route path="ipreportsusers" element={<AllUsersIPReport />} />
              <Route
                path="allusersattandance"
                element={<AllUsersAttendance />}
              />
              <Route
                path="attendance/user/:userId/"
                element={<SingleUserAttendance />}
              />

              <Route
                path="ipreport/user/:userId"
                element={<SingleUserIPReport />}
              />
              <Route path="addqcpointform" element={<QCPoints />} />
              <Route
                path="infaticaldashobard"
                element={<InfaticaAPIDetails />}
              />
              <Route path="announcements" element={<Announcements />} />
              <Route path="attendance" element={<AttendanceManagement />} />
              <Route path="newtask" element={<UserTaskCreation />} />
              <Route
                path="viewtaskcreation"
                element={<ViewUserTaskCreations />}
              />
              <Route path="addnewuser" element={<AddNewUser />} />
              <Route path="agentcsv" element={<AgentsCSVUPload />} />
              <Route path="agentsalary" element={<AgentSalaryAggrigation />} />
              <Route
                path="downloadsalaryworker"
                element={<DownloadSalaryWokers />}
              />
              <Route path="restemploysalary" element={<AgentsSalaryRecord />} />
              <Route
                path="generalsalarycalculator"
                element={<GeneralSalaryCaculator />}
              />
              <Route path="calendar" element={<CalendarManagement />} />
              <Route
                path="adminsideattandance"
                element={<AttandanceManagementtAdmin />}
              />
              <Route path="helpcenter" element={<HelpCenterManagement />} />
              <Route path="dailyipreport" element={<AgentDailyIPReports />} />
              <Route
                path="officeagentsalaryformula"
                element={<OfficeAgentsSalaryFormula />}
              />
              <Route path="wfhsalaryformula" element={<WFHSalaryFormula />} />
              <Route path="manageusers" element={<ManagerUsers />} />
              <Route path="noticeboard" element={<NoticeBoardCreation />} />
              <Route path="notifications" element={<NotificationsCreation />} />
              <Route path="singletask/:taskId" element={<SingleTaskItem />} />
              <Route
                path="performancemetrics"
                element={<PerformanceMetrics />}
              />
              <Route path="proxy/smart" element={<SmartProxy />} />
              <Route
                path="uploadSalaryRecord"
                element={<UploadSalaryRecord />}
              />
              <Route path="proxy/mango" element={<MangoProxy />} />
              <Route path="proxy/mangob" element={<MangoProxyB />} />
              <Route path="proxy/geo" element={<ProxyGeo />} />
              <Route path="proxyusage" element={<ProxyUsage />} />
              <Route path="reporting" element={<Reporting />} />
              <Route path="AllQCPoints" element={<AllUsersQCPoints />} />
              <Route
                path="qcpoints/user/:userId"
                element={<SingleUserQCPoints />}
              />
              <Route path="reportsgenerate" element={<ReportsGenerate />} />
              <Route path="salaryformula" element={<SalaryFormulaForm />} />
              <Route path="salarymanagement" element={<SalaryManagement />} />
              <Route path="settings" element={<SettingsAdmin />} />
              <Route
                path="termsandpolicies"
                element={<TermsAndPoliciesUser />}
              />

              <Route
                path="downloadsalaryreports"
                element={<DownloadSalaryReports />}
              />
              <Route
                path="attandancedownloadreports"
                element={<AttandanceDownloadReports />}
              />
              <Route
                path="qcpointsdownlaod"
                element={<QCPointsDownloadReports />}
              />
              <Route
                path="allagentrecord"
                element={<AllAgentsRegistraction />}
              />
              <Route
                path="registedusersdownlaodreports"
                element={<RegisteredUsersDownlaodReports />}
              />
              <Route
                path="allmangemenrerecord"
                element={<AllManagementRecord />}
              />
              <Route
                path="agentreportsipsdownlaod"
                element={<AgentsIPsReportsDownload />}
              />
              <Route
                path="downlaodproxyreports"
                element={<ProxyReportsDownlaod />}
              />

              <Route
                path="viewsinglesalary"
                element={<ViewSingleSalaryStatement />}
              />

              <Route
                path="attendance/user/:id"
                element={<SingleAgentAttendance />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ConfigProvider>
  </React.StrictMode>
);





















































