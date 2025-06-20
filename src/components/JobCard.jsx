// src/components/JobCard.jsx
import React from "react";

const JobCard = ({ title, company, location, posted }) => {
  return (
    <div className="border p-4 rounded-lg shadow hover:shadow-lg transition">
      <h3 className="text-xl font-bold text-blue-700">{title}</h3>
      <p className="text-gray-700">{company}</p>
      <p className="text-sm text-gray-500">{location}</p>
      <p className="text-xs text-gray-400 mt-2">Posted: {posted}</p>
      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Apply Now
      </button>
    </div>
  );
};

export default JobCard;
