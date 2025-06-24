// src/pages/UnauthorizedPage.jsx
import React from "react";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-gray-800">
      <h1 className="text-4xl font-bold mb-4">🚫 Unauthorized</h1>
      <p className="mb-6">You don’t have permission to access this page.</p>
      <Link
        to="/signin"
        className="text-blue-600 hover:underline border border-blue-600 px-4 py-2 rounded"
      >
        Go to Sign In
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
