import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import ManageUsersTable from "../../components/ManageUsersTable";
import { useNavigate } from "react-router-dom";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/unauthorized");
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        alert("❌ Failed to fetch users");
      }
    };

    fetchUsers();
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 ml-64 p-6">
        <div className="bg-blue-50 px-6 py-4 rounded-lg shadow-sm mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <ManageUsersTable data={users} />
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
