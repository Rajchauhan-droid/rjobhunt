import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white text-gray-800 fixed top-16 left-0 h-full p-6 shadow-xl border-r border-gray-200 transition-all duration-300">
      <div className="mb-10">
        <h2 className="text-2xl font-extrabold text-blue-600 tracking-wider">🚀 JobHunt</h2>
        <p className="text-sm text-gray-500">Find your next role</p>
      </div>

      <ul className="space-y-6 text-lg font-medium">
        <li>
          <NavLink
            to="/user-dashboard"
            className={({ isActive }) =>
              isActive
                ? "bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
                : "px-4 py-2 rounded-lg text-blue-700 hover:bg-blue-100 transition"
            }
          >
            🏠 Dashboard
          </NavLink>
        </li>
        <li>
          <a
            href="#"
            className="block px-4 py-2 rounded-lg text-blue-700 hover:bg-blue-100 transition"
          >
            💾 Saved Jobs
          </a>
        </li>
        <li>
          <a
            href="#"
            className="block px-4 py-2 rounded-lg text-blue-700 hover:bg-blue-100 transition"
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
