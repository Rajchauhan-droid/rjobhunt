// src/pages/SignIn.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("registeredUser");
    const savedAdmin = localStorage.getItem("adminUser");

    if (!savedUser) {
      localStorage.setItem(
        "registeredUser",
        JSON.stringify({
          name: "Raj Chauhan",
          email: "raj@example.com",
          password: "Raj@123",
          role: "user",
          phoneNumber: "9876543210",
          gender: "Male",
          dateOfBirth: "1997-05-15",
          address: "123 Main Street, Toronto, ON",
        })
      );
    }

    if (!savedAdmin) {
      localStorage.setItem(
        "adminUser",
        JSON.stringify({
          name: "Admin Raj",
          email: "admin@example.com",
          password: "Admin@123",
          role: "admin",
          phoneNumber: "1234567890",
          gender: "Male",
          dateOfBirth: "1990-01-01",
          address: "123 Admin Street",
        })
      );
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const savedUser = JSON.parse(localStorage.getItem("registeredUser"));
    const savedAdmin = JSON.parse(localStorage.getItem("adminUser"));

    if (form.role === "admin") {
      if (
        form.email === savedAdmin.email &&
        form.password === savedAdmin.password
      ) {
        localStorage.setItem("loggedInUser", JSON.stringify(savedAdmin));
        setSuccess("Logged in as Admin ✅");
        setTimeout(() => {
          window.location.href = "/admin-dashboard";
        }, 1000);
        return;
      } else {
        setError("Invalid admin credentials.");
        return;
      }
    }

    if (form.role === "user") {
      if (!savedUser) {
        setError("No user registered. Please register first.");
        return;
      }

      if (
        form.email === savedUser.email &&
        form.password === savedUser.password
      ) {
        localStorage.setItem("loggedInUser", JSON.stringify(savedUser));
        setSuccess(`Welcome, ${savedUser.name}! Redirecting...`);
        setTimeout(() => {
          window.location.href = "/user-dashboard";
        }, 1000);
        return;
      } else {
        setError("Invalid user credentials.");
        return;
      }
    }

    setError("Please select a valid role.");
  };

  const handleForgotPassword = () => {
    const savedUser = JSON.parse(localStorage.getItem("registeredUser"));
    const savedAdmin = JSON.parse(localStorage.getItem("adminUser"));

    const user =
      form.role === "admin" ? savedAdmin : form.role === "user" ? savedUser : null;

    if (user && forgotEmail === user.email) {
      alert(`Your password is: ${user.password}`);
    } else {
      alert("Email not found!");
    }

    setShowForgot(false);
  };

  return (
    <div className="min-h-screen bg-[url('/beach.jpg')] bg-cover flex items-center justify-center px-4">
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 pr-10 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-2 text-sm text-gray-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex justify-between text-sm">
            <label>
              <input
                type="radio"
                name="role"
                value="user"
                checked={form.role === "user"}
                onChange={handleChange}
              />{" "}
              User
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={form.role === "admin"}
                onChange={handleChange}
              />{" "}
              Admin
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
            Sign In
          </button>

          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>

          <p
            onClick={() => setShowForgot(true)}
            className="text-sm text-blue-600 cursor-pointer hover:underline text-right"
          >
            Forgot password?
          </p>
        </form>

        {showForgot && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-xl w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4">Forgot Password</h3>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleForgotPassword}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowForgot(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
