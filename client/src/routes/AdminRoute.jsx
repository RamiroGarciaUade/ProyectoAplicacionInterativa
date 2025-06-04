import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, token } = useAuth();
  if (!token || !user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default AdminRoute; 