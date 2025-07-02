// src/components/ViewPlatformModal.jsx
import React from "react";

const ViewPlatformModal = ({ platform, onClose }) => {
  if (!platform) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Platform Details</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 text-xl">✖️</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
          {Object.entries(platform).map(([key, value]) => (
            <div key={key} className="flex flex-col border rounded p-3 bg-gray-50 shadow-sm">
              <span className="font-semibold text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
              <span className="break-words text-gray-900">{value !== null && value !== undefined && value !== "" ? String(value) : "—"}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPlatformModal;
