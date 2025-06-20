// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import JobCard from "../components/JobCard";
import ProfileMenu from "../components/ProfileMenu";
import mockJobs from "../data/mockJobs"; // ✅ Local demo data

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setJobs(mockJobs);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Top nav */}
      <header className="fixed top-0 right-0 left-0 h-16 bg-white shadow flex justify-end items-center px-6 z-20">
        <ProfileMenu />
      </header>

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="ml-64 w-full p-6 overflow-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold">Jobs</h1>
              <p className="text-gray-600">Discover and apply to jobs</p>
            </div>
            <a href="#" className="text-blue-600 hover:underline mt-2">View all →</a>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <input type="text" placeholder="Search jobs" className="border rounded px-4 py-2 w-full" />
            <input type="text" placeholder="City" className="border rounded px-4 py-2 w-full" />
            <select className="border rounded px-4 py-2 w-full">
              <option>Date</option>
              <option>Newest</option>
              <option>Oldest</option>
            </select>
            <select className="border rounded px-4 py-2 w-full">
              <option>Type</option>
              <option>Full-time</option>
              <option>Part-time</option>
            </select>
          </div>

          {/* Job cards */}
          {loading ? (
            <p>Loading jobs...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, index) => (
                <JobCard key={index} {...job} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
