// src/components/ProfileDropdown.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedInUser");
    navigate("/signin");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="rounded-full border border-gray-300 bg-white w-10 h-10 flex items-center justify-center"
      >
        <span className="text-gray-500 text-xl">👤</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50">
          <div className="p-4 border-b">
            <div className="font-semibold">{user?.name || "User"}</div>
            <div className="text-sm text-gray-600">{user?.email}</div>
          </div>
          <ul className="text-sm text-gray-700 divide-y">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Account Settings</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Privacy Policy</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Terms</li>
            <li
              className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
              onClick={handleLogout}
            >
              Log out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
