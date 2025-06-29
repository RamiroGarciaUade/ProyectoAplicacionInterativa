import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser, selectIsAuthenticated } from "../redux/userSlice";

const AdminRoute = ({ children }) => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  if (!isAuthenticated || !user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default AdminRoute; 