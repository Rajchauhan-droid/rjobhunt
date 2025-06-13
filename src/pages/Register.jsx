// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    address: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (Object.values(form).some((v) => !v)) {
      toast.warn("All fields are required.", { position: "top-center" });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.warn("Please enter a valid email address.", { position: "top-center" });
      return false;
    }

    if (form.password.length < 6) {
      toast.warn("Password must be at least 6 characters.", { position: "top-center" });
      return false;
    }

    if (form.password !== form.confirmPassword) {
      toast.warn("Passwords do not match.", { position: "top-center" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const user = {
      name: form.name,
      email: form.email,
      password: form.password,
      phoneNumber: form.phoneNumber,
      gender: form.gender,
      dateOfBirth: `${form.dateOfBirth}T00:00:00.000+00:00`,
      address: form.address,
    };

    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/addNewUser`, user, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.success) {
        toast.success("Registration successful! Please verify your email.", { position: "top-center" });
        setTimeout(() => navigate("/signin"), 2000); // ✅ fixed route
      } else {
        toast.error(res.data.message || "Registration failed.", { position: "top-center" });
      }
    } catch (err) {
      if (err.response?.data?.message === "Email already exists") {
        toast.error("Email already exists. Try logging in.", { position: "top-center" });
      } else {
        toast.error("Network error or server issue.", { position: "top-center" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/beach.jpg')] bg-cover bg-center flex items-center justify-center px-4">
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl w-full max-w-2xl animate-slide-up">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">Create an Account</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="input" />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="input" />
          <input name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} className="input" />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="input" />
          <select name="gender" value={form.gender} onChange={handleChange} className="input">
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className="input" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="input"
          />
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="input"
          />

          <div className="col-span-2 text-right text-sm -mt-2">
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-blue-600 hover:underline"
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </button>
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? "bg-gray-500" : "bg-blue-700 hover:bg-blue-800"} text-white py-2 px-4 rounded transition`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
            <p className="text-sm text-center mt-4">
              Already registered?{" "}
              <Link to="/signin" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
