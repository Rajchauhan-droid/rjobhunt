import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const NotificationPreferences = () => {
  const [notification, setNotification] = useState({
    emailEnabled: false,
    smsEnabled: false,
    discordEnabled: false,
    phoneNumber: "",
    discordWebhook: "",
    emailTarget: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchNotificationConfig();
  }, []);

  const fetchNotificationConfig = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/preferences/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotification(res.data?.data || {});
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch notification preferences.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNotification((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/preferences/notifications`,
        notification,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("✅ Notification preferences updated.");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update preferences.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-10 md:px-24 font-inter">
      <ToastContainer />
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between text-sm text-gray-600">
          <button onClick={() => navigate("/account-settings")} className="text-blue-600 hover:underline">
            ← Back to Account Settings
          </button>
          <button onClick={() => navigate("/user-dashboard")} className="text-blue-600 hover:underline">
            Dashboard
          </button>
        </div>

        <h1 className="text-4xl font-bold text-gray-900">Notification Preferences</h1>

        <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 text-lg font-medium text-gray-700">
              <input
                type="checkbox"
                name="emailEnabled"
                checked={notification.emailEnabled}
                onChange={handleChange}
              />
              Email Notifications
            </label>
            {notification.emailEnabled && (
              <input
                type="email"
                name="emailTarget"
                placeholder="Enter email address (optional override)"
                value={notification.emailTarget || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          {/* SMS */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 text-lg font-medium text-gray-700">
              <input
                type="checkbox"
                name="smsEnabled"
                checked={notification.smsEnabled}
                onChange={handleChange}
              />
              SMS Notifications
            </label>
            {notification.smsEnabled && (
              <input
                type="text"
                name="phoneNumber"
                placeholder="Enter phone number"
                value={notification.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          {/* Discord */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 text-lg font-medium text-gray-700">
              <input
                type="checkbox"
                name="discordEnabled"
                checked={notification.discordEnabled}
                onChange={handleChange}
              />
              Discord Notifications
            </label>
            {notification.discordEnabled && (
              <input
                type="text"
                name="discordWebhook"
                placeholder="Enter Discord webhook URL"
                value={notification.discordWebhook}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          <div className="text-right">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 shadow"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
