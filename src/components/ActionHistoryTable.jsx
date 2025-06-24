// src/components/ActionHistoryTable.jsx
import React, { useState } from "react";
import { CSVLink } from "react-csv";

const ActionHistoryTable = ({ data = [], isAdmin = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState(null);

  const filteredData = data.filter((item) => {
    const values = [
      item?.userPublicId,
      item?.userEmail,
      item?.userRole,
      item?.actionType,
      item?.actionEntity,
      item?.description,
      item?.ipAddress,
      item?.deviceInfo,
    ];
    return values.some((val) =>
      val?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aVal =
      key === "timestamp" ? new Date(a[key]) : a[key]?.toLowerCase?.() || a[key] || "";
    const bVal =
      key === "timestamp" ? new Date(b[key]) : b[key]?.toLowerCase?.() || b[key] || "";
    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const csvHeaders = [
    ...(isAdmin
      ? [
          { label: "User's ID", key: "userPublicId" },
          { label: "Email", key: "userEmail" },
          { label: "Role", key: "userRole" },
        ]
      : []),
    { label: "Timestamp", key: "timestamp" },
    { label: "Action", key: "actionType" },
    { label: "Entity", key: "actionEntity" },
    { label: "Description", key: "description" },
    { label: "IP Address", key: "ipAddress" },
    { label: "Device Info", key: "deviceInfo" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen px-6 py-6">
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Action History</h1>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search actions..."
              className="border text-lg px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <CSVLink
              filename="action-history.csv"
              data={sortedData}
              headers={csvHeaders}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-lg hover:bg-blue-700"
            >
              Export CSV
            </CSVLink>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {isAdmin && (
                  <>
                    <th className="px-6 py-4 text-left cursor-pointer" onClick={() => requestSort("userPublicId")}>
                      User ID
                    </th>
                    <th className="px-6 py-4 text-left cursor-pointer" onClick={() => requestSort("userEmail")}>
                      Email
                    </th>
                    <th className="px-6 py-4 text-left cursor-pointer" onClick={() => requestSort("userRole")}>
                      Role
                    </th>
                  </>
                )}
                <th className="px-6 py-4 text-left cursor-pointer" onClick={() => requestSort("timestamp")}>
                  Timestamp
                </th>
                <th className="px-6 py-4 text-left cursor-pointer" onClick={() => requestSort("actionType")}>
                  Action
                </th>
                <th className="px-6 py-4 text-left cursor-pointer" onClick={() => requestSort("actionEntity")}>
                  Entity
                </th>
                <th className="px-6 py-4 text-left cursor-pointer" onClick={() => requestSort("description")}>
                  Description
                </th>
                <th className="px-6 py-4 text-left cursor-pointer" onClick={() => requestSort("ipAddress")}>
                  IP Address
                </th>
                <th className="px-6 py-4 text-left cursor-pointer" onClick={() => requestSort("deviceInfo")}>
                  Device Info
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-800">
              {sortedData.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 9 : 6} className="text-center py-20 text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-5xl mb-2">📂</div>
                      <p className="text-lg">No action history found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    {isAdmin && (
                      <>
                        <td className="px-6 py-4">{item.userPublicId || "—"}</td>
                        <td className="px-6 py-4">{item.userEmail || "—"}</td>
                        <td className="px-6 py-4">{item.userRole || "—"}</td>
                      </>
                    )}
                    <td className="px-6 py-4">{item.timestamp ? new Date(item.timestamp).toLocaleString() : "—"}</td>
                    <td className="px-6 py-4 font-semibold text-blue-600">{item.actionType}</td>
                    <td className="px-6 py-4">{item.actionEntity}</td>
                    <td className="px-6 py-4 text-gray-700">{item.description}</td>
                    <td className="px-6 py-4">{item.ipAddress}</td>
                    <td className="px-6 py-4 max-w-sm truncate">{item.deviceInfo}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActionHistoryTable;
