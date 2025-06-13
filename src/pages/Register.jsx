// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Register = () => {
  const [form, setForm] = useState({
    name: "Raj Chauhan",
    email: "raj@example.com",
    password: "Raj@123",
    confirmPassword: "Raj@123",
    phoneNumber: "9876543210",
    gender: "Male",
    dateOfBirth: "1997-05-15",
    address: "123 Main Street, Toronto, ON",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (Object.values(form).some((v) => !v)) {
      setError("All fields are required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email.");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    const user = {
      publicId: uuidv4(),
      name: form.name,
      email: form.email,
      password: form.password,
      phoneNumber: form.phoneNumber,
      gender: form.gender,
      dateOfBirth: `${form.dateOfBirth}T00:00:00.000+00:00`,
      address: form.address,
    };

    // Save to localStorage
    localStorage.setItem("registeredUser", JSON.stringify(user));

    setSuccess("Registration successful ✅");
    setTimeout(() => navigate("/sign-in"), 1500);
  };

  return (
    <div className="min-h-screen bg-[url('/beach.jpg')] bg-cover bg-center flex items-center justify-center px-4">
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl w-full max-w-2xl animate-slide-up">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">Create an Account</h2>

        {error && <p className="text-red-600 text-center text-sm mb-3">{error}</p>}
        {success && <p className="text-green-600 text-center text-sm mb-3">{success}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="input" />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="input" />
          <input name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} className="input" />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="input" />
          <select name="gender" value={form.gender} onChange={handleChange} className="input">
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
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

          <div className="col-span-2 text-right -mt-2 text-sm">
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
              className="w-full bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800 transition"
            >
              Register
            </button>
            <p className="text-sm text-center mt-4">
              Already registered?{" "}
              <a href="/signin" className="text-blue-600 hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
