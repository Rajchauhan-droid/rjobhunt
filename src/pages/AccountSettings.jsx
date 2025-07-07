import React from "react";
import { useNavigate } from "react-router-dom";

const AccountSettings = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const role = user?.role?.toUpperCase(); // normalize the role
  const email = user?.email || "";
  const name = user?.name || "User";

  const settings = [
    {
      title: "Personal info",
      desc: "Provide personal details and how we can reach you",
      link: "/account/personal-info",
      icon: "👤",
    },
    {
      title: "Login & security",
      desc: "Update your password and secure your account",
      link: "/account/login-security",
      icon: "🔐",
    },
    ...(role === "USER" || role === "ROLE_USER"
      ? [
          {
            title: "Job Preferences",
            desc: "Manage your preferred job titles for smart suggestions",
            link: "/account/job-preferences",
            icon: "💼",
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-blue-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Account</h2>
          <button
            onClick={() => navigate("/user-dashboard")}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
        <p className="text-gray-700 font-semibold mb-8">
          {name}, <span className="text-gray-600">{email}</span>
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {settings.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.link)}
              className="cursor-pointer bg-white rounded-xl shadow hover:shadow-md p-5 transition"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
