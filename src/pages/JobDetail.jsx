import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProfileMenu from "../components/ProfileMenu";

const JobDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state;

  if (!job) {
    return (
      <div className="flex h-screen">
        <Sidebar userType="user" />
        <div className="flex-1 ml-64 overflow-y-auto bg-gray-50">
          <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow z-10 flex justify-end items-center px-6">
            <ProfileMenu />
          </header>
          <main className="pt-20 px-6">
            <p className="text-red-600">No job data provided.</p>
            <button
              className="mt-4 text-blue-600 underline"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar userType="user" />

      {/* Main Content */}
      <div className="flex-1 ml-64 overflow-y-auto bg-gray-50">
        <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow z-10 flex justify-end items-center px-6">
          <ProfileMenu />
        </header>

        <main className="pt-20 px-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
          <p className="text-gray-600 mb-1">Company: {job.company}</p>
          <p className="text-gray-600 mb-1">Location: {job.location}</p>
          <p className="text-gray-600 mb-1">Job Type: {job.type}</p>
          <p className="text-gray-600 mb-4">
            Posted on: {new Date(job.date).toLocaleDateString()}
          </p>

          <h3 className="text-lg font-semibold mt-4 mb-2">Job Description</h3>
          <p className="text-gray-700 mb-4">
            This is a mock job description. You can add more detailed job responsibilities,
            required qualifications, and benefits here based on your actual data source.
          </p>

          <div className="flex gap-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Apply Now
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Save Job
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobDetail;
