import React from "react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white text-gray-800 fixed top-16 left-0 h-full p-6 shadow-xl border-r border-gray-200">
      <div className="mb-10">
        <h2 className="text-2xl font-extrabold text-blue-600 tracking-wider">👑 Admin Panel</h2>
        <p className="text-sm text-gray-500">Manage everything</p>
      </div>

      <ul className="space-y-6 text-lg font-medium">
        <li>
          <NavLink
            to="/admin-dashboard"
            end
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
          <NavLink
            to="/admin-dashboard/users"
            className={({ isActive }) =>
              isActive
                ? "bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
                : "px-4 py-2 rounded-lg text-blue-700 hover:bg-blue-100 transition"
            }
          >
            👥 Manage Users
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin-dashboard/jobs"
            className={({ isActive }) =>
              isActive
                ? "bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
                : "px-4 py-2 rounded-lg text-blue-700 hover:bg-blue-100 transition"
            }
          >
            💼 Manage Jobs
          </NavLink>
        </li>
      </ul>

      <div className="absolute bottom-6 left-6 text-xs text-gray-500">
        © {new Date().getFullYear()} Admin Panel
      </div>
    </aside>
  );
};

export default AdminSidebar;
