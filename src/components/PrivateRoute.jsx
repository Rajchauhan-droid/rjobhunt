// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRole }) => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const navigate = useNavigate();

  if (!user) {
    console.warn("Not logged in. Redirecting to /signin...");
    return <Navigate to="/signin" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    console.warn("Role mismatch. Redirecting to /unauthorized...");
    return <Navigate to="/unauthorized" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/signin");
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#e74c3c",
            color: "#fff",
            border: "none",
            padding: "6px 12px",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>
      <hr style={{ margin: "1rem 0" }} />
      {children}
    </div>
  );
};

export default PrivateRoute;
