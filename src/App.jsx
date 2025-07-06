// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import Verify from "./pages/Verify";
import ForgotPassword from "./pages/ForgotPassword";
import UnauthorizedPage from "./pages/UnauthorizedPage";

import PrivateRoute from "./components/PrivateRoute";

import UserDashboardHome from "./pages/UserDashboard";
import AccountSettings from "./pages/AccountSettings";
import PersonalInfo from "./pages/account/PersonalInfo";
import LoginSecurity from "./pages/account/LoginSecurity";

import AdminDashboardLayout from "./pages/AdminDashboardLayout";
import ActionHistoryPage from "./pages/ActionHistoryPage";
import ManageUsers from "./pages/admin/ManageUsers";
import ManagePlatformPage from "./pages/admin/ManagePlatformPage"
import UserScraperPage from "./pages/UserScraperPage"


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* User Dashboard */}
        <Route
          path="/user-dashboard"
          element={
            <PrivateRoute allowedRole={["user"]}>
              <UserDashboardHome />
            </PrivateRoute>
          }
        >
          <Route path="action-history" element={<ActionHistoryPage />} />
          <Route path="scraping" element={<UserScraperPage />} />

          </Route>

        {/* User Account Pages */}
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
          path="/account/login-security"
          element={
            <PrivateRoute allowedRole={["user", "admin"]}>
              <LoginSecurity />
            </PrivateRoute>
          }
        />

        {/* Admin Dashboard with Nested Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute allowedRole={["admin"]}>
              <AdminDashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<h2 className="text-xl">Welcome to Admin Dashboard</h2>} />
          <Route path="action-history" element={<ActionHistoryPage />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-platform" element={<ManagePlatformPage />} />

        </Route>

        {/* 404 Catch-All */}
        <Route path="*" element={<h2 className="p-6 text-center">404: Page not found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
