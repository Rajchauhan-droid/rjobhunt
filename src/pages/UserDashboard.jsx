// src/pages/UserDashboard.jsx
import React from "react";

const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  return (
    <div className="h-screen flex items-center justify-center text-2xl font-bold text-green-700">
      Welcome to User Dashboard, @{user?.name}
    </div>
  );
};

export default UserDashboard;
