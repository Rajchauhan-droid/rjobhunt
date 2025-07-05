// src/pages/JobsPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const JobsPage = () => {
  const navigate = useNavigate();

  const allJobs = [
    {
      id: 1,
      title: "Product Lead - ARTM Program",
      company: "Masabi",
      location: "Toronto, Ontario, Canada",
      type: "Full-time",
      date: "2024-07-02",
    },
    {
      id: 2,
      title: "Pharmacist",
      company: "MDM Pharmacy",
      location: "Mississauga, Ontario, Canada",
      type: "Part-time",
      date: "2024-07-01",
    },
    {
      id: 3,
      title: "Occupational Therapist",
      company: "SE Health",
      location: "Hamilton, Ontario, Canada",
      type: "Full-time",
      date: "2024-06-29",
    },
  ];

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [jobType, setJobType] = useState("Any type");
  const [sortOption, setSortOption] = useState("Date");

  const [filteredJobs, setFilteredJobs] = useState(allJobs);
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 6;
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const handleSearch = () => {
    const filtered = allJobs.filter((job) => {
      const keywordMatch =
        job.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        job.company.toLowerCase().includes(searchKeyword.toLowerCase());

      const cityMatch = job.location
        .toLowerCase()
        .includes(searchCity.toLowerCase());

      const typeMatch = jobType === "Any type" || job.type === jobType;

      return keywordMatch && cityMatch && typeMatch;
    });

    const sorted = [...filtered].sort((a, b) => {
      return sortOption === "Date"
        ? new Date(b.date) - new Date(a.date)
        : a.title.localeCompare(b.title);
    });

    setFilteredJobs(sorted);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchKeyword("");
    setSearchCity("");
    setJobType("Any type");
    setSortOption("Date");
    setFilteredJobs(allJobs);
    setCurrentPage(1);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Jobs</h2>
      <p className="text-gray-600 mb-4">Discover and apply to jobs</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search jobs by keyword"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <select
          className="border p-2 rounded"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="Date">Date</option>
          <option value="Relevance">Relevance</option>
        </select>
        <select
          className="border p-2 rounded"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
        >
          <option>Any type</option>
          <option>Full-time</option>
          <option>Part-time</option>
        </select>
        <input
          type="text"
          placeholder="Search for a city"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>

        <button
          onClick={handleClear}
          className="bg-gray-300 text-black px-4 py-2 rounded"
        >
          Clear all
        </button>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedJobs.length > 0 ? (
          paginatedJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => navigate(`/user-dashboard/job/${job.id}`, { state: job })}
              className="cursor-pointer border p-4 rounded shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-500">{job.company}</p>
              <p className="text-sm text-gray-500">{job.location}</p>
              <p className="text-xs text-gray-400 mb-2">
                Posted on: {new Date(job.date).toLocaleDateString()}
              </p>
              <div className="flex justify-between items-center">
                <button className="text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition">
                  Scan
                </button>
                <button className="text-gray-400 hover:text-black">🔖</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-3">No jobs found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JobsPage;
