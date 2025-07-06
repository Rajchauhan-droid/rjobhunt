// src/layouts/AdminDashboardLayout.jsx
import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import ProfileMenu from "../components/ProfileMenu";
import { Outlet } from "react-router-dom";

const AdminDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-white border-b h-16 px-4 lg:px-6 shadow-sm">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          ☰
        </button>
        <div className="flex-1 flex justify-end">
          <ProfileMenu />
        </div>
      </header>


      <div className="flex flex-1 pt-16 overflow-hidden">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
