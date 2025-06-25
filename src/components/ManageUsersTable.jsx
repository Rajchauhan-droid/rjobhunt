// src/components/ManageUsersTable.jsx
import React, { useState } from "react";

const ManageUsersTable = ({ users = [], setUsers }) => {
  const [search, setSearch] = useState("");

  const filtered = users.filter((user) => {
    return (
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.address?.toLowerCase().includes(search.toLowerCase()) ||
      user.phoneNumber?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleDelete = (userId) => {
    // Example: delete call or setUsers(prev => prev.filter(...))
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <div className="bg-gray-50 min-h-screen px-6 py-6">
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
          <table className="min-w-full divide-y divide-gray-200 text-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Phone</th>
                <th className="px-6 py-4 text-left">Address</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-5xl mb-2">📂</div>
                      <p className="text-lg">No users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((user, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">{user.name || "—"}</td>
                    <td className="px-6 py-4">{user.email || "—"}</td>
                    <td className="px-6 py-4">{user.phoneNumber || "—"}</td>
                    <td className="px-6 py-4">{user.address || "—"}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                      <button className="bg-green-500 text-white px-3 py-1 rounded">Update</button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => handleDelete(user.id)}
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
