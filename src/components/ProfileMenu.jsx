// src/components/ProfileMenu.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ActionHistoryTable from "./ActionHistoryTable"; // update path if different


const ProfileMenu = () => {
  const user =
    JSON.parse(localStorage.getItem("loggedInUser")) ||
    JSON.parse(localStorage.getItem("adminUser"));

  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const [showHistory, setShowHistory] = useState(false);


  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.warn("Logout API call failed:", err);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("registeredUser");
      navigate("/signin");
    }
  };

  const handleClickLogout = () => {
    setShowLogoutModal(true);
    setOpen(false);
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="relative inline-block text-left" ref={menuRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center focus:outline-none"
        >
          <span className="text-gray-600 text-xl">👤</span>
        </button>

        {open && (
          <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
            <div className="p-4 border-b">
              <div className="font-semibold">{user?.name || "User"}</div>
              <div className="text-sm text-gray-500">{user?.email}</div>
            </div>
            <div className="py-1">
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Account Settings</button>
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Privacy Policy</button>
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Terms</button>

              <button
                onClick={handleClickLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
              >
                Log out
              </button>
            </div>
          </div>
        )}
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Logout</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileMenu;
