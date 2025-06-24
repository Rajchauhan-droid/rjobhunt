// src/components/AdminSidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  History,
  Settings,
  MoreHorizontal,
  LogOut,
  Users,
  UserCheck,
  FileText
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();
  const basePath = "/admin-dashboard";

  const menuItems = [
    { label: "Home", icon: <Home size={24} />, path: "" },
    { label: "Action History", icon: <History size={24} />, path: "action-history" },
    { label: "Manage Users", icon: <Users size={24} />, path: "manage-users" },
    { label: "Verify Accounts", icon: <UserCheck size={24} />, path: "verify-accounts" },
    { label: "Reports", icon: <FileText size={24} />, path: "reports" },
    { label: "Settings", icon: <Settings size={24} />, path: "settings" },
    { label: "Others", icon: <MoreHorizontal size={24} />, path: "others" }
  ];

  return (
    <aside className="w-64 h-full fixed top-0 left-0 bg-white pt-16 border-r shadow-md z-30">
      <nav className="flex flex-col space-y-2 px-6 text-lg">
        {menuItems.map(({ label, icon, path }) => {
          const fullPath = `${basePath}/${path}`;
          const isActive = location.pathname === fullPath;

          return (
            <Link
              key={label}
              to={fullPath}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition font-semibold ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
