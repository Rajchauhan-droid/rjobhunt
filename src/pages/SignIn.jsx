// src/pages/SignIn.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.warn("Please enter both email and password.", { position: "top-center" });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        form,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const resData = response.data;

      if (resData.success) {
        const { token, email, uid, role, name } = resData.data;
        const normalizedRole = role === "ROLE_ADMIN" ? "admin" : "user";

        localStorage.setItem("authToken", token);
        localStorage.setItem("loggedInUser", JSON.stringify({ uid, email, role: normalizedRole, name }));

        toast.success("Login successful! Redirecting...", { position: "top-center" });

        setTimeout(() => {
          navigate(normalizedRole === "admin" ? "/admin-dashboard" : "/user-dashboard");
        }, 1500);
      } else {
        toast.error(resData.message || "Login failed. Please try again.", { position: "top-center" });
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Network Error: Could not connect to the server.";
      toast.error(msg, { position: "top-center" });
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/beach.jpg')] bg-cover flex items-center justify-center px-4">
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"} text-white font-semibold py-2 rounded`}
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>

          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>

          <p className="text-sm text-right">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </p>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default SignIn;
