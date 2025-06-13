// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRole }) => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  console.log("PrivateRoute → user:", user);

  if (!admin) {
    console.warn("Not logged in. Redirecting to /signin...");
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    console.warn("Role mismatch. Redirecting to /signin...");
    return <Navigate to="/user-dashboard" replace />;
  }

  console.log("Access granted to:", user.role);
  return children;
};

export default PrivateRoute;
