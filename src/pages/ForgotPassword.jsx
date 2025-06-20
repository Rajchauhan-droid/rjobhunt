// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.warn("Please enter your email address.", { position: "top-center" });
      return;
    }

    try {
      setLoading(true);
      const formData = new URLSearchParams();
      formData.append("email", email);

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (res.data.success) {
        toast.success("A new password has been sent to your email.", {
          position: "top-center",
        });
      } else {
        toast.error(res.data.message || "Unable to reset password.", {
          position: "top-center",
        });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Something went wrong while processing your request.";
      toast.error(msg, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/beach.jpg')] bg-cover flex items-center justify-center px-4">
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md animate-slide-up">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Forgot Password
        </h2>
        <form onSubmit={handleReset} className="grid gap-4">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold py-2 px-4 rounded transition`}
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Remembered your password?{" "}
          <a href="/signin" className="text-blue-600 hover:underline">
            Sign In
          </a>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
