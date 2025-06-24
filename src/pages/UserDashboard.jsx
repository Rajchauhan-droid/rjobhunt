// src/layouts/UserDashboardLayout.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import ProfileMenu from "../components/ProfileMenu";
import { Outlet } from "react-router-dom";

const UserDashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar userType="user" />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        {/* Header */}
        <header className="h-16 fixed top-0 left-64 right-0 bg-white shadow z-20 flex justify-end items-center px-6">
          <ProfileMenu />
        </header>

        {/* Page content with top padding for header */}
        <main className="pt-12 px-4 h-full overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
