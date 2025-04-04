import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* General Routes */}
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

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
            <Route path="noticecalendar" element={<NoticeCalendar />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="tasks/:taskId" element={<ViewSingleTask />} />
            <Route path="pattern" element={<Pattern />} />
            <Route path="settings" element={<Settings />} />
            <Route path="termsandpolicies" element={<TermsAndPoliciesUser />} />
            <Route path="uploadwork" element={<UploadWork />} />
            <Route path="usertasks" element={<UserTasks />} />
          </Route>

          {/* Admin Dashboard Grouped Under AdminLayout */}
          <Route
            path="/admin/dashboard"
            element={
              // <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <AdminLayout />
              // </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="ipreportsusers" element={<AllUsersIPReport />} />
            <Route path="allusersattandance" element={<AllUsersAttendance />} />
            <Route
              path="attendance/user/:userId/:year/:month"
              element={<SingleUserAttendance />}
            />

            <Route
              path="ipreport/user/:userId"
              element={<SingleUserIPReport />}
            />
            <Route path="addqcpointform" element={<QCPoints />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="attendance" element={<AttendanceManagement />} />
            <Route path="taskcreation" element={<UserTaskCreation />} />
            <Route path="addnewuser" element={<AddNewUser />} />
            <Route path="calendar" element={<CalendarManagement />} />
            <Route path="helpcenter" element={<HelpCenterManagement />} />
            <Route path="manageusers" element={<ManagerUsers />} />
            <Route path="noticeboard" element={<NoticeBoardCreation />} />
            <Route path="notifications" element={<NotificationsCreation />} />
            <Route path="performancemetrics" element={<PerformanceMetrics />} />
            <Route path="proxyusage" element={<ProxyUsage />} />
            <Route path="reporting" element={<Reporting />} />
            <Route path="AllQCPoints" element={<AllUsersQCPoints />} />
            <Route
              path="qcpoints/user/:userId"
              element={<SingleUserQCPoints />}
            />
            <Route path="reportsgenerate" element={<ReportsGenerate />} />
            <Route path="salarymanagement" element={<SalaryManagement />} />
            <Route path="settings" element={<SettingsAdmin />} />
            <Route path="termsandpolicies" element={<TermsAndPolicies />} />
            <Route
              path="viewsinglesalary"
              element={<ViewSingleSalaryStatement />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);
