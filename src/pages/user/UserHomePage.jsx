import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Search,
  MapPin,
  Filter,
  SlidersHorizontal,
  Loader2,
  ChevronLeft,
  ChevronRight,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserJobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  const fetchJobs = async (page = 1, keywordInput = "", where = "Canada", sort_by = "date", category = "") => {
    setLoading(true);

    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("adminUser")) || JSON.parse(localStorage.getItem("loggedInUser"));

    if (!token || !user?.role) {
      navigate("/unauthorized");
      return;
    }

    const searchKeyword = keywordInput.trim() || "Software Engineer";

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          keyword: searchKeyword,
          where,
          sort_by,
          page,
          category,
          results_per_page: 20,
        },
      });

      const jobList = Array.isArray(res.data?.data?.results) ? res.data.data.results : [];
      setJobs(jobList);
      setSelectedJob(jobList[0] || null);

      const totalResults = res.data?.data?.count || jobList.length || 1;
      setTotalPages(Math.ceil(totalResults / 20));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("adminUser")) || JSON.parse(localStorage.getItem("loggedInUser"));

    if (!token || !user?.role) {
      navigate("/unauthorized");
      return;
    }

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/jobs/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const categoryList = Array.isArray(res.data?.data?.results) ? res.data.data.results : [];
      setCategories(categoryList);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories.");
    }
  };

  useEffect(() => {
    fetchJobs(1, "", "Canada", "date");
    fetchCategories();
  }, [navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs(1, keyword, location, sortBy, selectedCategory);
  };

  const handleClearFilters = () => {
    setKeyword("");
    setLocation("");
    setSortBy("date");
    setSelectedCategory("");
    setCurrentPage(1);
    fetchJobs(1, "", "Canada", "date");
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    fetchJobs(newPage, keyword, location, sortBy, selectedCategory);
  };

  return (
    <div className="bg-gradient-to-br from-[#F2F7FA] to-white min-h-screen">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Hero */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">Live Job Board</h1>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">Search fresh job opportunities updated in real-time.</p>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="bg-white rounded-2xl shadow border p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Available Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.tag}
                  onClick={() => {
                    setSelectedCategory(cat.tag);
                    setCurrentPage(1);
                    fetchJobs(1, keyword, location, sortBy, cat.tag);
                  }}
                  className={`text-xs font-medium px-3 py-1 rounded-full transition ${
                    selectedCategory === cat.tag
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-blue-100 text-gray-800"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow border p-4 w-full space-y-4 md:space-y-0 md:flex md:items-end gap-4">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1">Keyword</label>
            <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
              <Search className="text-gray-500" size={16} />
              <input type="text" placeholder="e.g., Software Engineer" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="flex-grow outline-none ml-2 text-sm" />
            </div>
          </div>

          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
              <MapPin className="text-gray-500" size={16} />
              <input type="text" placeholder="e.g., Toronto, Canada" value={location} onChange={(e) => setLocation(e.target.value)} className="flex-grow outline-none ml-2 text-sm" />
            </div>
          </div>

          <div className="w-full md:w-40">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm">
              <SlidersHorizontal className="text-gray-500" size={16} />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="flex-grow outline-none ml-2 text-sm bg-transparent">
                <option value="date">Date</option>
                <option value="relevance">Relevance</option>
                <option value="salary">Salary</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>

          <button type="submit" className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 transition shadow focus:ring-2 focus:ring-blue-300">
            <Filter size={16} className="mr-2" /> Search
          </button>
        </form>

        <div className="flex justify-end">
          <button onClick={handleClearFilters} className="flex items-center gap-2 px-4 py-2 rounded-lg border text-gray-700 border-gray-300 hover:bg-gray-100 transition text-sm">
            <XCircle size={16} /> Clear Filters
          </button>
        </div>

        {/* Job List */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow border overflow-y-auto max-h-[70vh]">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-blue-600" size={32} />
              </div>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.id} onClick={() => setSelectedJob(job)} className={`p-4 cursor-pointer border-b transition ${selectedJob?.id === job.id ? "bg-blue-50 border-l-4 border-blue-600" : "hover:bg-gray-50 hover:shadow-sm"} rounded-md`}>
                  <h3 className="font-semibold text-gray-800 text-base mb-1">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company?.display_name || "Unknown Company"}</p>
                  <p className="text-xs text-gray-500">{job.location?.display_name || "Unknown Location"}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-6 text-sm">No jobs found.</p>
            )}
          </div>

          {/* Job Details */}
          <div className="flex-1 bg-white rounded-2xl shadow border p-6 min-h-[300px] transition hover:shadow-md">
            {selectedJob ? (
              <>
                <h2 className="text-xl font-bold mb-2 text-gray-900">{selectedJob.title}</h2>
                <p className="text-base text-blue-700 mb-3 font-medium">{selectedJob.company?.display_name || "Unknown Company"}</p>
                <div className="flex flex-wrap items-center text-gray-700 mb-4 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedJob.location?.display_name || "Unknown Location"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs bg-indigo-100 text-indigo-700 rounded-full px-2 py-0.5 capitalize">
                      {selectedJob.category?.label || "Category: N/A"}
                    </span>
                  </div>
                </div>
                <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed mb-4">{selectedJob.description || "No description available."}</div>
                {selectedJob.redirect_url && (
                  <a href={selectedJob.redirect_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-white bg-green-600 hover:bg-green-700 rounded-lg px-4 py-2 gap-2 shadow text-sm focus:ring-2 focus:ring-green-300">
                    <ExternalLink size={18} /> Apply on Company Site
                  </a>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-center py-10 text-sm">Select a job to view details.</p>
            )}
          </div>
        </div>

        {/* Pagination */}
        {jobs.length > 0 && (
          <div className="flex justify-center gap-4 items-center pt-6 text-sm">
            <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className={`flex items-center gap-1 px-4 py-2 rounded-lg border transition ${currentPage === 1 ? "text-gray-400 border-gray-200 cursor-not-allowed" : "text-gray-700 border-gray-300 hover:bg-gray-100 hover:shadow-sm"}`}>
              <ChevronLeft size={16} /> Prev
            </button>
            <span className="text-gray-700 font-medium">Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className={`flex items-center gap-1 px-4 py-2 rounded-lg border transition ${currentPage === totalPages ? "text-gray-400 border-gray-200 cursor-not-allowed" : "text-gray-700 border-gray-300 hover:bg-gray-100 hover:shadow-sm"}`}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserJobBoard;
