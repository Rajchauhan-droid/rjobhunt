// src/components/ManageUsersTable.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const ManageUsersTable = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setUsers(res.data.data);
        } else {
          toast.error(res.data.message || "Users not found");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users. Server may be down or endpoint incorrect.");
      }
    };

    fetchUsers();
  }, []);

  const filtered = users.filter((user) =>
    [
      user.publicId,
      user.email,
      user.role,
      user.phoneNumber,
      user.gender,
      user.dateOfBirth,
      user.address,
    ]
      .map((field) => (field || "").toString().toLowerCase())
      .some((value) => value.includes(search.toLowerCase()))
  );

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const paginatedUsers = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / usersPerPage);

  const toggleAccountStatus = async (publicId, status) => {
    try {
      const token = localStorage.getItem("authToken");
      const endpoint = status === 1 ? "activateAccount" : "deactivateAccount";

      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/admin/${endpoint}?publicId=${publicId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success !== false) {
        toast.success(res.data.message || "Status updated successfully");

        setUsers((prev) =>
          prev.map((u) =>
            u.publicId === publicId
              ? { ...u, accountStatus: { ...u.accountStatus, statusId: status } }
              : u
          )
        );
      } else {
        toast.error(res.data.message || "Failed to update status");
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || err?.response?.data?.error || "Server error";
      toast.error("Error: " + errorMsg);
      console.error("Account status toggle error:", err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen px-6 py-6">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Manage Users</h1>
          <input
            type="text"
            placeholder="Search by any field..."
            className="w-full md:w-1/2 border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Public ID</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Gender</th>
                <th className="px-4 py-3 text-left">DOB</th>
                <th className="px-4 py-3 text-left">Address</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-800">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl mb-2">📂</span>
                      <p className="text-lg">No users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 break-all">{user.publicId}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2 capitalize">
                      {user.role?.replace("ROLE_", "")}
                    </td>
                    <td className="px-4 py-2">{user.phoneNumber || "—"}</td>
                    <td className="px-4 py-2">{user.gender || "—"}</td>
                    <td className="px-4 py-2">
                      {user.dateOfBirth
                        ? new Date(user.dateOfBirth).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-2">{user.address || "—"}</td>
                    <td className="px-4 py-2">
                      {user.accountStatus?.statusId === 1 ? (
                        <span className="text-green-600 font-semibold">Active</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Suspended</span>
                      )}
                    </td>
                    <td className="px-4 py-2 flex flex-wrap gap-2">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                        View
                      </button>
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                        Update
                      </button>
                      <button
                        onClick={() =>
                          toggleAccountStatus(
                            user.publicId,
                            user.accountStatus?.statusId === 1 ? 2 : 1
                          )
                        }
                        className={`${
                          user.accountStatus?.statusId === 1
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        } text-white px-3 py-1 rounded`}
                      >
                        {user.accountStatus?.statusId === 1 ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageUsersTable;
