import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) navigate("/sign-in");
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/sign-in");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100">
      <h1 className="text-3xl font-bold text-green-700">
        Welcome, {user?.name} 👋
      </h1>
      <p className="mt-2 text-gray-600">You are successfully logged in.</p>
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
