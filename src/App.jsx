// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn"; 
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import Verify from "./pages/Verify"; // Add this
import ForgotPassword from "./pages/ForgotPassword";
import AccountSettings from "./pages/AccountSettings"; // Import this



function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirect to /signin */}
        <Route path="/" element={<Navigate to="/signin" replace />} />

        {/* Public routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />


        <Route
          path="/account-settings"
          element={
            <PrivateRoute allowedRole="user">
              <AccountSettings />
            </PrivateRoute>
          }
        />

        {/* Protected user route */}
        <Route
          path="/user-dashboard"
          element={
            <PrivateRoute allowedRole="user">
              <UserDashboard />
            </PrivateRoute>
          }
        />

        {/* Protected admin route */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute allowedRole="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<h2 className="p-6 text-center">404: Page not found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
