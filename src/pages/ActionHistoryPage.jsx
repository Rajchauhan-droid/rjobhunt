// src/pages/ActionHistoryPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ActionHistoryTable from "../components/ActionHistoryTable";
import { useNavigate } from "react-router-dom";

const ActionHistoryPage = () => {
    const [data, setData] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("authToken");
            const user =
                JSON.parse(localStorage.getItem("adminUser")) ||
                JSON.parse(localStorage.getItem("loggedInUser"));

            if (!token || !user?.role) {
                navigate("/unauthorized");
                return;
            }

            const role = user.role?.toLowerCase(); // "user" or "admin"
            const isAdminUser = role === "admin";
            const isRegularUser = role === "user";

            if (!isAdminUser && !isRegularUser) {
                navigate("/unauthorized");
                return;
            }

            setIsAdmin(isAdminUser);

            const endpoint = isAdminUser
                ? "/api/action_history"
                : "/api/action_history/user";

            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}${endpoint}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setData(res.data?.data || []);
            } catch (err) {
                if ([401, 403].includes(err.response?.status)) {
                    navigate("/unauthorized");
                } else {
                    alert("❌ Failed to fetch action history.");
                    console.error("Fetch error:", err);
                }
            }
        };

        fetchData();
    }, [navigate]);

    return <ActionHistoryTable data={data} isAdmin={isAdmin} />;
};

export default ActionHistoryPage;
