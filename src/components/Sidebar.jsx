// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white fixed top-16 left-0 h-full p-6 shadow-2xl rounded-tr-2xl rounded-br-2xl transition-all duration-300">
      <div className="mb-10">
        <h2 className="text-2xl font-extrabold text-blue-400 tracking-wider">🚀 JobHunt</h2>
        <p className="text-sm text-gray-400">Find your next role</p>
      </div>

      <ul className="space-y-6 text-lg">
        <li>
          <NavLink
            to="/user-dashboard"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition hover:bg-blue-600 ${
                isActive ? "bg-blue-700 shadow-lg" : "bg-gray-700 hover:shadow-md"
              }`
            }
          >
            🏠 Dashboard
          </NavLink>
        </li>
        <li>
          <a
            href="#"
            className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-blue-600 hover:shadow-md transition"
          >
            💾 Saved Jobs
          </a>
        </li>
        <li>
          <a
            href="#"
            className="block px-4 py-2 rounded-lg bg-gray-700 hover:bg-blue-600 hover:shadow-md transition"
          >
            ⚙️ Settings
          </a>
        </li>
      </ul>

      <div className="absolute bottom-6 left-6 text-xs text-gray-500">
        © {new Date().getFullYear()} JobHunt
      </div>
    </aside>
  );
};

export default Sidebar;
