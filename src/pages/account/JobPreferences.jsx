import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobPreferences = () => {
  const [jobTitles, setJobTitles] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    if (user?.role !== "user") {
      navigate("/unauthorized");
      return;
    }
    fetchJobPreferences();
  }, []);

  const fetchJobPreferences = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/preferences/job-titles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJobTitles(res.data?.data || []);
    } catch (err) {
      toast.error("❌ Failed to fetch job preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newTitle.trim()) return toast.error("❌ Enter a job title");

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/preferences/job-titles`,
        [newTitle],
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setJobTitles(res.data?.data || []);
      setNewTitle("");
      toast.success("✅ Job title added");
    } catch (err) {
      toast.error("❌ Failed to add job title");
    }
  };

  const handleDelete = async (titleToRemove) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/preferences/job-titles/delete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { jobTitle: titleToRemove },
        }
      );
      setJobTitles(res.data?.data || []);
      toast.success("✅ Job title removed");
    } catch (err) {
      toast.error("❌ Failed to delete job title");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbfd] px-4 py-8 md:px-20 font-inter">
      <ToastContainer />
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
          <button
            onClick={() => navigate("/account-settings")}
            className="text-blue-600 hover:underline"
          >
            ← Back to Account Settings
          </button>
          <button
            onClick={() => navigate("/user-dashboard")}
            className="text-blue-600 hover:underline"
          >
            Dashboard
          </button>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-6">Job Preferences</h1>

        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter preferred job title"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-base"
            />
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Add
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : jobTitles.length === 0 ? (
            <p className="text-gray-600 mt-4">No job preferences found.</p>
          ) : (
            <ul className="space-y-3 mt-4">
              {jobTitles.map((title, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg"
                >
                  <span className="text-gray-800">{title}</span>
                  <button
                    onClick={() => handleDelete(title)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobPreferences;
