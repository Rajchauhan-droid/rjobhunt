// src/pages/UserScraperPage.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { PlayCircle, Loader2, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css"; // optional but recommended for styling
import ScrapingHistory from "../pages/components/ScrapingHistory"; // adjust path if needed


const UserScraperPage = () => {
  const [platforms, setPlatforms] = useState([]);
  const [formData, setFormData] = useState({ platformId: "", query: "", location: "", maxPages: 5 });
  const [keywords, setKeywords] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [scrapedJobs, setScrapedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const navigate = useNavigate();
  const sourceRef = useRef(null); // 🔥 SSE connection ref
  const [showHistory, setShowHistory] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("adminUser")) || JSON.parse(localStorage.getItem("loggedInUser"));
    if (!token || !user?.role) {
      navigate("/unauthorized");
      return;
    }
    const fetchPlatforms = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/platforms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlatforms(Array.isArray(res.data?.data?.common) ? res.data.data.common : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load available platforms.");
      }
    };
    fetchPlatforms();
  }, [navigate]);

  // 🔥 Cleanup SSE when component unmounts
  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        console.log("🔌 Cleaning up SSE connection");
        sourceRef.current.close();
      }
    };
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.platformId) errs.platformId = "Platform is required";
    if (!formData.query || formData.query.length < 2) errs.query = "Query must be at least 2 characters";
    if (!formData.location || formData.location.length < 2) errs.location = "Location must be at least 2 characters";
    if (formData.maxPages < 1 || formData.maxPages > 50) errs.maxPages = "Max pages must be between 1 and 50";
    return errs;
  };

  const handleStopScraping = async () => {
    const result = await Swal.fire({
      title: "Stop Scraper?",
      text: "Are you sure you want to stop the scraper? This will immediately halt the current scraping session.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, stop it",
      cancelButtonText: "No, keep scraping",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    const token = localStorage.getItem("authToken");
    try {
      console.log("🛑 Sending stop request to server...");
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/scraper/stop`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Scraper stopped successfully.");

      if (sourceRef.current) {
        console.log("🔌 Closing SSE connection on stop");
        sourceRef.current.close();
        sourceRef.current = null;
      }

      setLoadingJobs(false);
    } catch (error) {
      console.error("❌ Failed to stop scraper", error);
      toast.error(error.response?.data?.message || "Failed to stop scraper. Please try again.");
    }
  };

  const handleKeywordKeyDown = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      setKeywords((prev) => [...prev, e.target.value.trim()]);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setLoadingJobs(true); // ✅ start showing Stop button right away

    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("adminUser")) || JSON.parse(localStorage.getItem("loggedInUser"));
    const userId = user?.publicId || user?.uid;
    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      setSubmitting(false);
      setLoadingJobs(false);
      return;
    }

    try {
      console.log("🔗 Opening SSE stream for userId:", userId);
      sourceRef.current = new EventSource(`${import.meta.env.VITE_API_BASE_URL}/api/scraper/stream/${userId}`);

      sourceRef.current.onmessage = (event) => {
        const job = JSON.parse(event.data);
        setScrapedJobs((prev) => [job, ...prev.filter((j) => j.publicId !== job.publicId)]);
      };

      sourceRef.current.onerror = (error) => {
        console.error("❌ SSE connection error:", error);
        toast.error("Lost connection. Please restart scraping.");
        sourceRef.current.close();
        sourceRef.current = null;
        setLoadingJobs(false); // ✅ hide Stop button if SSE dies unexpectedly
      };

      const payload = {
        platformId: formData.platformId,
        query: formData.query,
        location: formData.location,
        maxPages: parseInt(formData.maxPages, 10),
        profileKeywords: keywords,
      };

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/scraper/start`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Scraper started. Listening for real-time jobs...");
    } catch (err) {
      console.error(err);
      if ([401, 403].includes(err.response?.status)) navigate("/unauthorized");
      else toast.error(err.response?.data?.message || "Failed to scrape jobs. Try again.");
      if (sourceRef.current) {
        sourceRef.current.close();
        sourceRef.current = null;
      }
      setLoadingJobs(false); // ✅ hide Stop button if starting scraping fails
    } finally {
      setSubmitting(false);
      // ⚠️ Do not reset loadingJobs here: leave it controlled by SSE events and handleStopScraping
    }
  };

  const handleExportCSV = () => {
    const headers = ["Title", "Company", "Location", "Salary", "URL"];
    const rows = scrapedJobs.map((j) => [j.title, j.company, j.location, j.salary, j.url || "N/A"]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    downloadFile(blob, "scraped_jobs.csv");
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(scrapedJobs, null, 2)], { type: "application/json" });
    downloadFile(blob, "scraped_jobs.json");
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredJobs = scrapedJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      job.location.toLowerCase().includes(locationFilter.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-tl from-[#F5F9FC] to-white min-h-screen py-8">
      <div className="w-full max-w-4xl mx-auto space-y-10">
        {/* Hero */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center bg-blue-100 rounded-full w-14 h-14 mx-auto animate-bounce">
            <PlayCircle className="text-blue-600" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Interactive Job Scraper</h1>
          <p className="text-gray-600">Configure your scraping request & view live results below.</p>
        </div>

        {/* Scraper form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-5 animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-3">Scraper Configuration</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Platform selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">Platform <span className="text-red-500 ml-1">*</span></label>
                <select
                  name="platformId"
                  value={formData.platformId}
                  onChange={(e) => setFormData({ ...formData, platformId: e.target.value })}
                  className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 ${errors.platformId ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"}`}
                >
                  <option value="">Choose a platform...</option>
                  {platforms.map((p) => (
                    <option key={p.publicId} value={p.publicId}>
                      {`${p.name} (${p.type.toUpperCase()}, ${p.parserType}) - ${p.notes}`}
                    </option>
                  ))}
                </select>
                {errors.platformId && <p className="text-red-500 text-sm mt-1">{errors.platformId}</p>}
              </div>
            </div>

            {/* Query, Location, Max Pages */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["query", "location"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 capitalize">{field} *</label>
                  <input
                    name={field}
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 ${errors[field] ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"}`}
                    placeholder={`e.g., ${field === "query" ? "Software Engineer" : "Toronto"}`}
                  />
                  {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Max Pages (1-50)</label>
                <input
                  type="number"
                  name="maxPages"
                  min={1}
                  max={50}
                  value={formData.maxPages}
                  onChange={(e) => setFormData({ ...formData, maxPages: e.target.value })}
                  className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 ${errors.maxPages ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"}`}
                />
                {errors.maxPages && <p className="text-red-500 text-sm mt-1">{errors.maxPages}</p>}
              </div>
            </div>

            {/* Keywords */}
            <div className="flex flex-wrap items-center gap-2 bg-gray-100 border border-gray-300 rounded px-3 py-2 min-h-[44px]">
              {keywords.map((kw, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs flex items-center gap-1 animate-pulse">
                  {kw}
                  <button type="button" className="hover:text-red-500" onClick={() => setKeywords((prev) => prev.filter((_, i) => i !== idx))}>×</button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Type keyword & press Enter..."
                className="flex-grow bg-gray-100 border-none focus:ring-0 focus:outline-none text-sm"
                onKeyDown={handleKeywordKeyDown}
              />
            </div>

            <div className="text-right">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center px-6 py-3 rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <PlayCircle size={18} className="mr-2" />
                    Submit Scraper Request
                  </>
                )}
              </button>
              {loadingJobs && (
                <button
                  type="button"
                  onClick={handleStopScraping}
                  className="inline-flex items-center px-6 py-3 rounded-md text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 transition ml-4"
                >
                  Stop Scraper
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="text-right">
          <button
            onClick={() => setShowHistory(true)}
            className="inline-flex items-center px-4 py-2 rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition mt-4"
          >
            View Scraping History
          </button>
        </div>

        <ScrapingHistory isOpen={showHistory} onClose={() => setShowHistory(false)} />

        {scrapedJobs.length > 0 && (
          <>
            {/* Filters and export buttons */}
            <div className="flex flex-col md:flex-row flex-wrap gap-4 items-center justify-between mt-6 bg-white p-4 rounded-lg shadow">
              <div className="flex w-full md:w-auto flex-grow gap-4">
                <input
                  type="text"
                  placeholder="Search job title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <input
                  type="text"
                  placeholder="Filter by location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="flex-grow border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleExportCSV} className="text-blue-600 flex items-center gap-1 hover:underline">
                  <Download size={16} /> CSV
                </button>
                <button onClick={handleExportJSON} className="text-blue-600 flex items-center gap-1 hover:underline">
                  <Download size={16} /> JSON
                </button>
              </div>
            </div>

            {/* Scraped jobs list */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 animate-fade-in-up overflow-y-auto max-h-[600px] mt-4">
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-3">Scraped Jobs</h2>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <div key={job.publicId} className="p-5 rounded-lg border-l-4 border-blue-400 bg-white hover:bg-gray-50 shadow transition-transform duration-300 ease-in-out transform hover:scale-[1.02] space-y-2 animate-fade-in">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <h3 className="text-md font-bold text-gray-800">{job.title}</h3>
                        <p className="text-gray-600 text-sm">{job.company} — {job.location}</p>
                      </div>
                      {job.url && (
                        <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                          View Job
                        </a>
                      )}
                    </div>
                    <div className="text-gray-700 text-sm">{job.description}</div>
                    {job.salary && job.salary !== "N/A" && (
                      <div className="text-green-700 text-sm font-semibold">Salary: {job.salary}</div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No scraped jobs match your filters.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserScraperPage;
