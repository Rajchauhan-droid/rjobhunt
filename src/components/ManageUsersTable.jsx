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
      const errorMsg = err?.response?.data?.message || "Server error";
      toast.error("Error: " + errorMsg);
      console.error("Account status toggle error:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Manage Users</h2>
        <input
          type="text"
          placeholder="Search users by any field..."
          className="w-full md:w-1/2 border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white text-sm text-gray-700 border border-gray-200">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left font-semibold border-b">Public ID</th>
              <th className="px-4 py-3 text-left font-semibold border-b">Email</th>
              <th className="px-4 py-3 text-left font-semibold border-b">Role</th>
              <th className="px-4 py-3 text-left font-semibold border-b">Phone</th>
              <th className="px-4 py-3 text-left font-semibold border-b">Gender</th>
              <th className="px-4 py-3 text-left font-semibold border-b">DOB</th>
              <th className="px-4 py-3 text-left font-semibold border-b">Address</th>
              <th className="px-4 py-3 text-left font-semibold border-b">Status</th>
              <th className="px-4 py-3 text-right font-semibold border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.publicId} className="hover:bg-gray-50 transition border-b last:border-b-0">
                  <td className="px-4 py-3 break-all">{user.publicId}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 capitalize">{user.role?.replace("ROLE_", "")}</td>
                  <td className="px-4 py-3">{user.phoneNumber || "—"}</td>
                  <td className="px-4 py-3">{user.gender || "—"}</td>
                  <td className="px-4 py-3">{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3">{user.address || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        user.accountStatus?.statusId === 1
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.accountStatus?.statusId === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button className="px-3 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition">Edit</button>
                    <button
                      onClick={() => toggleAccountStatus(user.publicId, user.accountStatus?.statusId === 1 ? 2 : 1)}
                      className={`px-3 py-1 rounded-md ${
                        user.accountStatus?.statusId === 1
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      } text-white transition`}
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

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {paginatedUsers.length === 0 ? (
          <p className="text-center text-gray-500">No users found.</p>
        ) : (
          paginatedUsers.map((user) => (
            <div key={user.publicId} className="bg-white rounded-lg shadow p-4 border">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800 break-all">{user.email}</h3>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    user.accountStatus?.statusId === 1
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.accountStatus?.statusId === 1 ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="text-sm text-gray-700 space-y-1">
                <p><span className="font-medium">Public ID:</span> {user.publicId}</p>
                <p><span className="font-medium">Role:</span> {user.role?.replace("ROLE_", "")}</p>
                <p><span className="font-medium">Phone:</span> {user.phoneNumber || "—"}</p>
                <p><span className="font-medium">Gender:</span> {user.gender || "—"}</p>
                <p><span className="font-medium">DOB:</span> {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "—"}</p>
                <p><span className="font-medium">Address:</span> {user.address || "—"}</p>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button className="px-3 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition">Edit</button>
                <button
                  onClick={() => toggleAccountStatus(user.publicId, user.accountStatus?.statusId === 1 ? 2 : 1)}
                  className={`px-3 py-1 rounded-md ${
                    user.accountStatus?.statusId === 1
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white transition`}
                >
                  {user.accountStatus?.statusId === 1 ? "Suspend" : "Activate"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 flex-wrap gap-2">
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
  );
};

export default ManageUsersTable;
