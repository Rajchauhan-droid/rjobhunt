import React, { useEffect, useState } from "react";
import { User, Layers, FileText, Bell, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const AdminHomePage = () => {
  const [stats, setStats] = useState({ users: 0, platforms: 0, reports: 0, notifications: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return toast.error("Missing token");

        const headers = { Authorization: `Bearer ${token}` };

        const [users, platforms, notifications] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/reports/users/total`, { headers }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/reports/platforms/total`, { headers }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/reports/notifications/total`, { headers }),
        ]);

        setStats({
          users: users.data || 0,
          platforms: platforms.data || 0,
          reports: 3,
          notifications: notifications.data?.total || 0,
        });
      } catch (error) {
        toast.error("Failed to load dashboard stats");
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  const shortcuts = [
    { icon: <User size={24} />, label: "Manage Users", path: "/admin/users" },
    { icon: <Layers size={24} />, label: "Manage Platforms", path: "/admin/platforms" },
    { icon: <FileText size={24} />, label: "Reports Dashboard", path: "/admin/reports" },
  ];

  return (
    <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-[#f0f4ff] via-[#f9fbfc] to-[#eef2f8]">
      {/* Welcome */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Welcome, Admin 🚀</h1>
        <p className="text-gray-500 mt-2 text-sm">Manage insights, users, platforms, and performance with ease.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <MetricCard icon={<User />} label="Total Users" value={stats.users} color="from-blue-500 to-blue-700" />
        <MetricCard icon={<Layers />} label="Total Platforms" value={stats.platforms} color="from-purple-500 to-purple-700" />
        <MetricCard icon={<FileText />} label="Available Reports" value={stats.reports} color="from-green-500 to-green-700" />
        <MetricCard icon={<Bell />} label="New Notifications" value={stats.notifications} color="from-orange-400 to-orange-600" />
      </div>

      {/* Shortcuts */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Shortcuts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {shortcuts.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="bg-white border shadow-md hover:shadow-xl rounded-xl py-6 px-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-blue-50"
            >
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-full p-3 mb-3 shadow-lg">
                {item.icon}
              </div>
              <div className="text-gray-700 font-semibold">{item.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Activity Summary */}
      <div className="backdrop-blur-md bg-white/80 shadow-xl border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Today’s Activity Summary</h3>
        </div>
        <p className="text-sm text-gray-600">
          Track today's scraping activities, user signups, and platform updates in the reports dashboard.
        </p>
        <button
          onClick={() => navigate("/admin-dashboard/reports")}
          className="mt-3 text-sm text-blue-600 hover:underline"
        >
          View Full Report →
        </button>
      </div>
    </div>
  );
};

// Beautified Metric Card
const MetricCard = ({ icon, label, value, color }) => (
  <div className={`bg-white shadow-md rounded-2xl p-5 border-l-8 bg-gradient-to-br ${color} text-white`}>
    <div className="flex items-center justify-between">
      <div className="text-sm font-medium">{label}</div>
      <div className="opacity-90">{icon}</div>
    </div>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

export default AdminHomePage;
