import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css"; // optional
import { toast } from "react-hot-toast";


const PAGE_SIZE = 5; // Adjust as needed

const ScrapingHistory = ({ isOpen, onClose }) => {
    const [requests, setRequests] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(requests.length / PAGE_SIZE);

    useEffect(() => {
        if (isOpen) {
            fetchScraperHistory();
            setCurrentPage(1);
        }
    }, [isOpen]);

    const fetchScraperHistory = async () => {
        const token = localStorage.getItem("authToken");
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/scraper/requests/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests(res.data?.data || []);
        } catch (error) {
            console.error("❌ Failed to fetch scraping history", error);
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearAll = async () => {
        const result = await Swal.fire({
            title: "Clear All History?",
            text: "This will permanently delete all your scraper requests. Continue?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, clear all",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        const token = localStorage.getItem("authToken");
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/scraper/requests/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("All scraper requests cleared successfully.");
            setRequests([]); // Empty the requests list in UI
        } catch (err) {
            console.error("❌ Failed to clear all requests", err);
            toast.error(err.response?.data?.message || "Failed to clear all requests.");
        }
    };

    if (!isOpen) return null;

    const paginatedRequests = requests.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-y-auto relative">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-b flex items-center justify-between px-6 py-4 rounded-t-3xl shadow">
                    <h2 className="text-2xl font-bold">Scraping History</h2>
                    <div className="flex items-center gap-4">
                        {requests.length > 0 && (
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    onClick={handleClearAll}
                                    className="inline-flex items-center px-4 py-2 rounded-md text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 transition"
                                >
                                    Clear All History
                                </button>
                            </div>
                        )}
                        <button
                            className="hover:text-red-400 transition"
                            onClick={onClose}
                        >
                            <X size={28} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {loading ? (
                        <div className="text-center text-gray-600 animate-pulse">Loading history...</div>
                    ) : requests.length === 0 ? (
                        <div className="text-center text-gray-600">No scraping history found.</div>
                    ) : (
                        paginatedRequests.map((req, idx) => {
                            const key = req.publicId || `${currentPage}-${idx}`; // ✅ FIX duplicate key
                            const isOpen = expanded === key;
                            return (
                                <div key={key} className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition-transform duration-300 bg-white">
                                    {/* Accordion Header */}
                                    <button
                                        className="w-full flex justify-between items-center px-4 py-4 bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 focus:outline-none transition"
                                        onClick={() => setExpanded(isOpen ? null : key)}
                                    >
                                        <div className="text-left">
                                            <div className="text-lg font-semibold text-blue-800">{req.query || "N/A"}</div>
                                            <div className="text-sm text-gray-500">Location: {req.location || "N/A"} | Pages: {req.maxPages || "-"}</div>
                                        </div>
                                        {isOpen ? <ChevronUp className="text-blue-700" /> : <ChevronDown className="text-blue-700" />}
                                    </button>

                                    {/* Accordion Content */}
                                    {isOpen && (
                                        <div className="px-4 py-5 bg-gray-50 space-y-3 animate-fade-in">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Field label="Profile Keywords" value={req.profileKeywords?.join(", ")} />
                                                <Field label="Tags" value={req.tags?.join(", ")} />
                                                <Field label="Custom Options" value={
                                                    req.customOptions
                                                        ? Object.entries(req.customOptions).map(([k, v]) => `${k}: ${v}`).join(", ")
                                                        : "—"
                                                } />
                                                <Field label="Auto Learning" value={req.enableAutoLearning ? "Yes" : "No"} />
                                                <Field label="Description" value={req.description} />
                                                <Field label="Platform ID" value={req.platformId} />
                                                <Field label="Source" value={req.source} />
                                                <Field label="URL" value={
                                                    req.url ? (
                                                        <a href={req.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                                            {req.url}
                                                        </a>
                                                    ) : "—"
                                                } />
                                            </div>
                                            <Field label="Created At" value={req.created ? new Date(req.created).toLocaleString() : "—"} />
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}

                    {requests.length > PAGE_SIZE && (
                        <div className="flex justify-between items-center pt-4 border-t">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                                className="text-blue-600 font-semibold disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <div className="text-gray-700 text-sm">Page {currentPage} of {totalPages}</div>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                                className="text-blue-600 font-semibold disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Field = ({ label, value }) => (
    <div>
        <h4 className="font-semibold text-gray-700 mb-1">{label}</h4>
        <p className="text-sm text-gray-600">{value || "—"}</p>
    </div>
);

export default ScrapingHistory;
