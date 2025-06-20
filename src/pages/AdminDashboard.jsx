// AdminDashboard.jsx
import React from "react";

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  return (
    <div className="text-center p-10 text-xl text-purple-700">
      Welcome Admin Panel 👑<br />
      Logged in as: <strong>{user?.name}</strong>
    </div>
  );
};

export default AdminDashboard;
