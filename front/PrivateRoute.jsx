import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("rol");

  // If no token, redirect to login page
  if (!token) {
    return <Navigate to="/" />;
  }

  // If userRole is invalid or not allowed, redirect to a safe route (e.g., login)
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />;
  }

  // If token and role are valid, render the child route(s)
  return <Outlet />;
};

export default PrivateRoute;
