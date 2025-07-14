// Updated AdminReportPage.jsx (Frontend)

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import FileDownload from "js-file-download";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  ResponsiveContainer, LineChart, Line, Legend
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#d0ed57"];

const formatDate = (date) => date.toISOString().split("T")[0];

const AdminReportPage = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [startDate, setStartDate] = useState(formatDate(firstDay));
  const [endDate, setEndDate] = useState(formatDate(lastDay));

  const [userStats, setUserStats] = useState({});
  const [growthData, setGrowthData] = useState([]);
  const [notificationPrefs, setNotificationPrefs] = useState([]);
  const [jobNotifySummary, setJobNotifySummary] = useState([]);
  const [actionStats, setActionStats] = useState([]);
  const [preferenceImpact, setPreferenceImpact] = useState([]);
  const [loading, setLoading] = useState(true);

  const exportCSV = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/reports/users/export-csv`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      FileDownload(response.data, "users-report.csv");
    } catch (error) {
      toast.error("Export failed: " + (error.response?.statusText || error.message));
      console.error(error);
    }
  };

  const applyDateFilter = () => {
    fetchData(startDate, endDate);
  };

  const fetchData = async (start, end) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };
      const base = import.meta.env.VITE_API_BASE_URL;
      const dateParams = start && end ? `?startDate=${start}&endDate=${end}` : "";

      const [users, status, prefs, jobs, actions, preferences, growth] = await Promise.all([
        axios.get(`${base}/api/admin/reports/users/total${dateParams}`, { headers }),
        axios.get(`${base}/api/admin/reports/users/status${dateParams}`, { headers }),
        axios.get(`${base}/api/admin/reports/users/notification-preferences${dateParams}`, { headers }),
        axios.get(`${base}/api/admin/reports/notifications/source-breakdown${dateParams}`, { headers }),
        axios.get(`${base}/api/admin/reports/activity/actions${dateParams}`, { headers }),
        axios.get(`${base}/api/admin/reports/platforms/preference-impact${dateParams}`, { headers }),
        axios.get(`${base}/api/admin/reports/users/growth${dateParams}`, { headers })
      ]);

      setUserStats({ total: users.data, ...status.data });
      setGrowthData(Array.isArray(growth.data) ? growth.data : []);
      setNotificationPrefs(prefs.data && typeof prefs.data === "object"
        ? Object.entries(prefs.data).map(([name, value]) => ({ name, value })) : []);
      setJobNotifySummary(jobs.data && typeof jobs.data === "object"
        ? Object.entries(jobs.data).map(([name, value]) => ({ name, notificationCount: value })) : []);
      setActionStats(actions.data || []);
      setPreferenceImpact(Array.isArray(preferences.data) ? preferences.data : []);

      console.log("📈 User Growth", growth.data);
      console.log("⚙️ Actions", actions.data);
    } catch (err) {
      toast.error("Failed to load report data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(startDate, endDate);
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading admin reports...</p>;

  return (
    <div className="space-y-4 px-4 py-4">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">📊 Admin Reports Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
          >Export Users (CSV)</button>
          <button
            disabled
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow opacity-70 cursor-not-allowed"
          >Export Reports (Coming Soon)</button>
        </div>
      </div>

      <div className="flex gap-2 items-center mt-4">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded px-2 py-1" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded px-2 py-1" />
        <button
          onClick={applyDateFilter}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >Apply Filter</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={userStats.total} color="text-blue-600" />

        <PieChartCard
          title="Active vs Inactive Users"
          data={[{ name: "Active", value: userStats.Active || 0 }, { name: "Inactive", value: userStats.Inactive || 0 }]}
          dataKey="value"
        />

        {/* <FullWidthChart title="User Growth Over Time" height={250}>
          <LineChart data={growthData}>
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </FullWidthChart> */}

        <BarChartCard title="Notification Preferences" data={notificationPrefs} dataKey="value" />
        <BarChartCard title="Job Notification Summary" data={jobNotifySummary} dataKey="notificationCount" xKey="name" />
        <BarChartCard title="System Action History" data={actionStats} dataKey="count" xKey="actionType" />
        <BarChartCard title="Preference Weight Impact" data={preferenceImpact} dataKey="scrapeCount" xKey="platformName" />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className={`text-4xl font-bold ${color}`}>{value}</p>
  </div>
);

const BarChartCard = ({ title, data, dataKey, xKey = "name", barColor = "#8884d8" }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={Array.isArray(data) ? data : []}>
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={dataKey} fill={barColor} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const FullWidthChart = ({ title, children, height }) => (
  <div className="bg-white p-6 rounded-lg shadow md:col-span-2 lg:col-span-3">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <ResponsiveContainer width="100%" height={height}>
      {children}
    </ResponsiveContainer>
  </div>
);

const PieChartCard = ({ title, data, dataKey }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie dataKey={dataKey} data={data} cx="50%" cy="50%" outerRadius={70} label>
          {COLORS.map((color, i) => (<Cell key={i} fill={color} />))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default AdminReportPage;
