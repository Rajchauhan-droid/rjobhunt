// src/pages/admin/AdminDashboard.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminProfileMenu from "../../components/AdminProfileMenu";

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-100 via-green-100 to-blue-50">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow z-30 flex justify-end items-center px-6 border-b border-blue-200">
        <AdminProfileMenu />
      </header>

      {/* Sidebar + Content */}
      <div className="flex flex-1 pt-16">
        <AdminSidebar />

  
      </div>
    </div>
  );
};

export default AdminDashboard;
