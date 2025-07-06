// src/components/ViewPlatformModal.jsx
import React, { useState } from "react";

const ViewPlatformModal = ({ platform, onClose }) => {
  if (!platform) return null;

  // 🔹 Local state to toggle API key visibility
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        {/* Modal header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Platform Details</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-xl"
          >
            ✖️
          </button>
        </div>

        {/* API Key section if parserType is API */}
        {platform.parserType === "API" && platform.apiKey && (
          <div className="mb-6 p-4 border-l-4 border-blue-600 bg-blue-50 rounded">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-blue-700">API Key</h3>
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
              >
                {showApiKey ? "Hide API Key" : "Show API Key"}
              </button>
            </div>
            {showApiKey ? (
              <pre className="mt-2 whitespace-pre-wrap break-words text-blue-900">
                {platform.apiKey}
              </pre>
            ) : (
              <p className="mt-2 text-gray-500 italic">API key hidden</p>
            )}
          </div>
        )}

        {/* Platform details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
          {Object.entries(platform).map(([key, value]) => (
            key === "apiKey" ? null : ( // 🔹 Skip apiKey here, we display it separately above
              <div
                key={key}
                className="flex flex-col border rounded p-3 bg-gray-50 shadow-sm"
              >
                <span className="font-semibold text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}:
                </span>
                <span className="break-words text-gray-900">
                  {value !== null && value !== undefined && value !== "" 
                    ? String(value) 
                    : "—"}
                </span>
              </div>
            )
          ))}
        </div>

        {/* Close button */}
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
