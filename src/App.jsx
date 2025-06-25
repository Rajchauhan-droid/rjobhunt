// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import Verify from "./pages/Verify";
import ForgotPassword from "./pages/ForgotPassword";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ActionHistoryPage from "./pages/ActionHistoryPage";

import PrivateRoute from "./components/PrivateRoute";

import UserDashboardHome from "./pages/UserDashboard"; // You can rename as needed
import AdminDashboardHome from "./pages/AdminDashboardLayout"; // You can rename as needed
import AccountSettings from "./pages/AccountSettings";
import PersonalInfo from "./pages/account/PersonalInfo";
import LoginSecurity from "./pages/account/LoginSecurity";
import ManageUsers from "./pages/admin/ManageUsers";





function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/signin" replace />} />

        {/* Public routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* User Dashboard Layout */}
<Route
  path="/admin-dashboard/manage-users"
  element={
    <PrivateRoute allowedRole={["admin"]}>
      <ManageUsers />
    </PrivateRoute>
  }
/>


<Route
  path="/account/login-security"
  element={
    <PrivateRoute allowedRole={["user", "admin"]}>
      <LoginSecurity />
    </PrivateRoute>
  }
/>

<Route
  path="/account-settings"
  element={
    <PrivateRoute allowedRole={["user", "admin"]}>
      <AccountSettings />
    </PrivateRoute>
  }
/>

<Route
  path="/account/personal-info"
  element={
    <PrivateRoute allowedRole={["user", "admin"]}>
      <PersonalInfo />
    </PrivateRoute>
  }
/>

        <Route
          path="/user-dashboard"
          element={
            <PrivateRoute allowedRole={["user"]}>
              <UserDashboardHome />
            </PrivateRoute>
          }
        >
          <Route index element={<UserDashboardHome />} />
          <Route path="action-history" element={<ActionHistoryPage />} />
        </Route>

        {/* Admin Dashboard Layout */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute allowedRole={["admin"]}>
              <AdminDashboardHome />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboardHome />} />
          <Route path="action-history" element={<ActionHistoryPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<h2 className="p-6 text-center">404: Page not found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
