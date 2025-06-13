// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRole }) => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default PrivateRoute;
