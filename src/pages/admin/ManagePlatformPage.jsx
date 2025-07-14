// src/pages/admin/ManagePlatformPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import PlatformModal from "../components/PlatformModal";
import ViewPlatformModal from "../components/ViewPlatformModal"; 
import { toast } from "react-hot-toast";

const ManagePlatformPage = () => {
    const [platforms, setPlatforms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlatform, setSelectedPlatform] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const openViewModal = (platform) => {
        setSelectedPlatform(platform);
        setIsViewModalOpen(true);
    };


    const fetchPlatforms = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/platforms`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const platformsData = res.data?.data?.all;
            if (Array.isArray(platformsData)) {
                setPlatforms(platformsData);
            } else {
                console.error("API returned non-array data:", platformsData);
                toast.error("Unexpected response format. Contact your backend team.");
                setPlatforms([]);
            }
        } catch (error) {
            console.error("Error fetching platforms:", error);
            toast.error("Failed to load platforms.");
            setPlatforms([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPlatforms(); }, []);

    const handleDelete = async (publicId) => {
        if (!window.confirm("Are you sure you want to delete this platform?")) return;
        try {
            const token = localStorage.getItem("authToken");
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/admin/platforms/${publicId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Platform deleted successfully.");
            fetchPlatforms();
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete platform.");
        }
    };

    const openCreateModal = () => {
        setSelectedPlatform(null);
        setIsModalOpen(true);
    };

    const openEditModal = (platform) => {
        setSelectedPlatform(platform);
        setIsModalOpen(true);
    };

    const filteredPlatforms = platforms.filter((platform) =>
        [platform.name, platform.type, platform.scraperStatus, platform.notes]
            .map((field) => (field || "").toLowerCase())
            .some((val) => val.includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Manage Platforms</h1>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search platforms..."
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                        + Add Platform
                    </button>
                </div>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Loading platforms...</p>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full bg-white text-sm text-gray-700 border border-gray-200">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold border-b">Name</th>
                                <th className="px-4 py-3 text-left font-semibold border-b">Type</th>
                                <th className="px-4 py-3 text-left font-semibold border-b">Scraper Status</th>
                                <th className="px-4 py-3 text-left font-semibold border-b">Active</th>
                                <th className="px-4 py-3 text-left font-semibold border-b">Notes</th>
                                <th className="px-4 py-3 text-right font-semibold border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPlatforms.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                                        No platforms found.
                                    </td>
                                </tr>
                            ) : (
                                filteredPlatforms.map((platform) => (
                                    <tr key={platform.publicId} className="hover:bg-gray-50 transition border-b last:border-b-0">
                                        <td className="px-4 py-3">{platform.name}</td>
                                        <td className="px-4 py-3">{platform.type}</td>
                                        <td className="px-4 py-3 capitalize">{platform.scraperStatus}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${platform.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                }`}>
                                                {platform.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 truncate max-w-xs">{platform.notes || "—"}</td>
                                        <td className="px-4 py-3 text-right space-x-2">
                                            <button
                                                onClick={() => openViewModal(platform)}
                                                className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => openEditModal(platform)}
                                                className="px-3 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(platform.publicId)}
                                                className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
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
            )}

            {isModalOpen && (
                <PlatformModal
                    platform={selectedPlatform}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchPlatforms}
                    forAdmin // 👈 indicates admin mode to modal
                />
            )}

            {isViewModalOpen && (
                <ViewPlatformModal
                    platform={selectedPlatform}
                    onClose={() => setIsViewModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ManagePlatformPage;
