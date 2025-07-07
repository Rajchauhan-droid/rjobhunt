import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  History,
  User,
  Bookmark,
  FileText,
  Settings,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const basePath = "/user-dashboard";

  const menuItems = [
    { label: "Home", icon: <Home size={22} />, path: "home" },
    { label: "Action History", icon: <History size={22} />, path: "action-history" },
    { label: "Profile", icon: <User size={22} />, path: "profile" },
    { label: "Saved Jobs", icon: <Bookmark size={22} />, path: "jobs/saved" },
    { label: "Applied Jobs", icon: <FileText size={22} />, path: "jobs/applied" },
    { label: "Scraping", icon: <FileText size={22} />, path: "scraping" }, // ⬅️ NEW ITEM
    { label: "Settings", icon: <Settings size={22} />, path: "settings" },
  ];
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity lg:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 z-50 w-64 min-h-screen bg-white border-r shadow-sm pt-16 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
      >
        {/* Close button on mobile */}
        <div className="absolute top-4 right-4 lg:hidden">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col space-y-1 px-4 text-base font-medium">
          {menuItems.map(({ label, icon, path }) => {
            const fullPath = `${basePath}/${path}`;
            const isActive = location.pathname === fullPath;
            return (
              <Link
                key={label}
                to={fullPath}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-md px-4 py-3 transition ${isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
              >
                {icon}
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
