import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginSecurity = () => {
  const navigate = useNavigate();

  const [email] = useState("raajchauh@gmail.com");

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="min-h-screen bg-blue-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-500">
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate("/account-settings")}
            >
              Account
            </span>{" "}
            &gt; Login & security
          </div>
          <button
            onClick={() => navigate("/user-dashboard")}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Dashboard
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-6">Login & security</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {/* Login Section */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-4">Login</h3>

              {/* Email */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">Email address</p>
                  <p className="text-gray-800">{email}</p>
                </div>
                <button className="text-blue-600 text-sm hover:underline">Change</button>
              </div>

              {/* Password */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-gray-500">Password</p>
                    {!showPasswordForm && <p className="text-gray-800">**********</p>}
                  </div>
                  {!showPasswordForm && (
                    <button
                      className="text-blue-600 text-sm hover:underline"
                      onClick={() => setShowPasswordForm(true)}
                    >
                      Update
                    </button>
                  )}
                </div>

                {showPasswordForm && (
                  <div className="space-y-3 mt-2">
                    <div>
                      <label className="text-sm text-gray-600">Current password</label>
                      <input
                        type="password"
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">New password</label>
                      <input
                        type="password"
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Confirm password</label>
                      <input
                        type="password"
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                        onClick={() => {
                          // TODO: Connect with backend
                          console.log("Updating password", {
                            currentPassword,
                            newPassword,
                            confirmPassword,
                          });
                          setShowPasswordForm(false);
                        }}
                      >
                        Update password
                      </button>
                      <button
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setCurrentPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Section */}

          </div>

          {/* RIGHT SIDE: Security Info */}
          <div>
            <div className="bg-white p-6 rounded-xl shadow text-sm text-gray-600">
              <div className="text-2xl mb-2">🔐</div>
              <p className="font-semibold text-gray-800 mb-1">Keeping your account secure</p>
              <p>
                We regularly review accounts to make sure they’re secure as possible.
                We’ll also let you know if there’s more you can do to increase the
                security of your account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSecurity;
