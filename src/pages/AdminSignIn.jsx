import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminSignIn = () => {
  const [form, setForm] = useState({ email: "", password: "", adminCode: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password || !form.adminCode) {
      toast.warn("Please fill in all fields including admin code.", { position: "top-center" });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          email: form.email,
          password: form.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Code": form.adminCode, // 💡 Custom admin code header
          },
        }
      );

      const resData = response.data;

      if (resData.success) {
        const { token, email, uid, role, name } = resData.data;
        const normalizedRole = role === "ROLE_ADMIN" ? "admin" : "user";

        if (normalizedRole !== "admin") {
          toast.error("Access denied. Not an admin account.", { position: "top-center" });
          return;
        }

        localStorage.setItem("authToken", token);
        localStorage.setItem("loggedInUser", JSON.stringify({ uid, email, role: normalizedRole, name }));

        toast.success("Admin login successful! Redirecting...", { position: "top-center" });

        setTimeout(() => {
          navigate("/admin-dashboard");
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
        <h2 className="text-2xl font-bold text-center mb-6">Admin Sign In</h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            name="email"
            type="email"
            placeholder="Admin Email"
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

          <input
            type="text"
            name="adminCode"
            placeholder="Admin Secret Code"
            value={form.adminCode}
            onChange={handleChange}
            className="w-full border border-red-400 rounded px-4 py-2 focus:outline-none focus:border-red-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? "bg-gray-500" : "bg-red-600 hover:bg-red-700"} text-white font-semibold py-2 rounded`}
          >
            {loading ? "Logging in..." : "Sign In as Admin"}
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AdminSignIn;
