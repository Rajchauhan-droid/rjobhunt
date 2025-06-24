// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  History,
  User,
  Briefcase,
  MoreHorizontal,
  LogOut,
  Settings,
  Bookmark,
  FileText
} from "lucide-react";

const Sidebar = ({ userType }) => {
  const location = useLocation();
  const basePath = userType === "admin" ? "/admin-dashboard" : "/user-dashboard";

  const menuItems = [
    { label: "Home", icon: <Home size={24} />, path: "" },
    { label: "Action History", icon: <History size={24} />, path: "action-history" },
    { label: "Profile", icon: <User size={24} />, path: "profile" },
    {
      label: "Jobs",
      icon: <Briefcase size={24} />,
      path: "jobs",
      subRoutes: [
        { label: "Saved Jobs", path: "jobs/saved", icon: <Bookmark size={20} /> },
        { label: "Applied Jobs", path: "jobs/applied", icon: <FileText size={20} /> }
      ]
    },
    ...(userType === "admin"
      ? [{ label: "Others", icon: <MoreHorizontal size={24} />, path: "others" }]
      : []),
    { label: "Settings", icon: <Settings size={24} />, path: "settings" }
  ];

  return (
    <aside className="w-64 h-full fixed top-0 left-0 bg-white pt-16 border-r shadow-md">
      {/* Logo */}
      {/* <div className="flex items-center justify-center mb-6">
        <img src="/logo.png" alt="Logo" className="w-32" />
      </div> */}

      {/* Navigation Menu */}
      <nav className="flex flex-col space-y-2 px-6 text-lg">
        {menuItems.map(({ label, icon, path, subRoutes }) => {
          const fullPath = `${basePath}/${path}`;
          const isActive = location.pathname === fullPath;

          return (
            <div key={label} className="space-y-1">
              <Link
                to={fullPath}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition font-semibold ${
                  isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {icon}
                <span>{label}</span>
              </Link>

              {subRoutes && location.pathname.startsWith(fullPath) && (
                <div className="ml-8 space-y-1">
                  {subRoutes.map(({ label: subLabel, path: subPath, icon: subIcon }) => {
                    const fullSubPath = `${basePath}/${subPath}`;
                    const isSubActive = location.pathname === fullSubPath;
                    return (
                      <Link
                        key={subLabel}
                        to={fullSubPath}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                          isSubActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {subIcon}
                        <span>{subLabel}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
