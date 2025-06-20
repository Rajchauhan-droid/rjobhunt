// src/pages/AccountSettings.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const cards = [
  {
    title: "Personal info",
    desc: "Provide personal details and how we can reach you",
  },
  {
    title: "Login & security",
    desc: "Update your password and secure your account",
  },
  {
    title: "Job match preferences",
    desc: "Update job search location and job type for better results",
  },
  {
    title: "Subscriptions",
    desc: "Update your subscription",
  },
  {
    title: "Communications",
    desc: "Manage your communication preferences",
  },
  {
    title: "Referrals",
    desc: "Invite friends to earn free scans",
  },
];

const AccountSettings = () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Account</h1>
          <button
            onClick={() => navigate("/user-dashboard")}
            className="text-sm text-blue-700 hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
        <p className="mb-8 text-gray-600 font-medium">
          <strong>{user?.name}</strong>, {user?.email}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
