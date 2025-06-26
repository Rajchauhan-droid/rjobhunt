import React from "react";
import { useNavigate } from "react-router-dom";

const LoginSecurity = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const email = user?.email || "";

  return (
    <div className="min-h-screen bg-blue-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/account-settings")}
          >
            ← Account Settings
          </span>
          <button
            onClick={() => navigate("/user-dashboard")}
            className="text-blue-600 hover:underline"
          >
            Dashboard
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-6">Login & Security</h2>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">Login Information</h3>

          {/* Email Display */}
          <div className="mb-4">
            <p className="text-sm text-gray-500">Email address</p>
            <p className="text-gray-800">{email}</p>
          </div>

          {/* Forgot Password Redirect */}
          <p className="text-sm">
            <span className="text-gray-500">Forgot your password?</span>{" "}
            <button
              className="text-blue-600 hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Reset it here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSecurity;
