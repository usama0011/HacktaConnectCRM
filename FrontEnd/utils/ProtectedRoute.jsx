// src/routes/ProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useUserContext();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // If user role is not allowed, navigate based on role
    const adminRoles = [
      "Super Admin",
      "HR",
      "Floor Manager",
      "Assistant Floor Manager",
    ];
    if (adminRoles.includes(user.role)) {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
