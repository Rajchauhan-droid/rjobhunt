// src/components/ProfileMenu.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileMenu = () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedInUser");
    navigate("/signin");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
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
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
