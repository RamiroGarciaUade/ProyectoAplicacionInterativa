import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";

const AdminRoute = ({ children }) => {
  const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);
  
  if (!isAuthenticated || !token || !user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default AdminRoute; 