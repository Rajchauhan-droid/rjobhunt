// src/components/ManageUsersTable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageUsersTable = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setUsers(res.data.data);
      } else {
        toast.error(res.data.message || "Failed to fetch users");
      }
    } catch (err) {
      toast.error("Error fetching users");
    }
  };

  const handleDelete = async (publicId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${publicId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setUsers((prev) => prev.filter((u) => u.publicId !== publicId));
        toast.success("User deleted successfully");
      } else {
        toast.error(res.data.message || "Failed to delete user");
      }
    } catch (err) {
      toast.error("Error deleting user");
    }
  };

  const filtered = users.filter((user) =>
    [user.email, user.address, user.phoneNumber, user.gender]
      .some((field) => field?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-gray-50 min-h-screen px-6 py-6">
      <ToastContainer />
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Manage Users</h1>
          <input
            type="text"
            placeholder="Search users..."
            className="border text-lg px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm lg:text-base">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">Public ID</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Gender</th>
                <th className="px-6 py-3 text-left">DOB</th>
                <th className="px-6 py-3 text-left">Address</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-5xl mb-2">📂</div>
                      <p className="text-lg">No users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((user, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 break-all">{user.publicId}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.role?.replace("ROLE_", "")}</td>
                    <td className="px-6 py-4">{user.phoneNumber || "—"}</td>
                    <td className="px-6 py-4">{user.gender || "—"}</td>
                    <td className="px-6 py-4">
                      {user.dateOfBirth
                        ? new Date(user.dateOfBirth).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-6 py-4">{user.address || "—"}</td>
                    <td className="px-6 py-4 flex gap-2 flex-wrap">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                        View
                      </button>
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                        Update
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        onClick={() => handleDelete(user.publicId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsersTable;
