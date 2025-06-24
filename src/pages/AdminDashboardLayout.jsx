// src/layouts/AdminDashboardLayout.jsx
import React from "react";
import AdminSidebar from "../components/AdminSidebar";

import ProfileMenu from "../components/ProfileMenu";
import { Outlet } from "react-router-dom";

const AdminDashboardLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow z-20 flex justify-end items-center px-6">
        <ProfileMenu />
      </header>
      <div className="flex flex-1 pt-16">
        <AdminSidebar isAdmin />
        <main className="ml-64 w-full p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
