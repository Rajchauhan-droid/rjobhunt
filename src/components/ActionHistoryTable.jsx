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
    const aVal = key === "timestamp" ? new Date(a[key]) : a[key]?.toLowerCase?.() || a[key] || "";
    const bVal = key === "timestamp" ? new Date(b[key]) : b[key]?.toLowerCase?.() || b[key] || "";
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Action History</h2>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search actions..."
            className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CSVLink
            filename="action-history.csv"
            data={sortedData}
            headers={csvHeaders}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-base hover:bg-blue-700 text-center"
          >
            Export CSV
          </CSVLink>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white text-sm text-gray-700 border border-gray-200">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {isAdmin && (
                <>
                  <th className="px-4 py-3 text-left font-semibold border-b cursor-pointer" onClick={() => requestSort("userPublicId")}>User ID</th>
                  <th className="px-4 py-3 text-left font-semibold border-b cursor-pointer" onClick={() => requestSort("userEmail")}>Email</th>
                  <th className="px-4 py-3 text-left font-semibold border-b cursor-pointer" onClick={() => requestSort("userRole")}>Role</th>
                </>
              )}
              <th className="px-4 py-3 text-left font-semibold border-b cursor-pointer" onClick={() => requestSort("timestamp")}>Timestamp</th>
              <th className="px-4 py-3 text-left font-semibold border-b cursor-pointer" onClick={() => requestSort("actionType")}>Action</th>
              <th className="px-4 py-3 text-left font-semibold border-b cursor-pointer" onClick={() => requestSort("actionEntity")}>Entity</th>
              <th className="px-4 py-3 text-left font-semibold border-b cursor-pointer" onClick={() => requestSort("description")}>Description</th>
              <th className="px-4 py-3 text-left font-semibold border-b cursor-pointer" onClick={() => requestSort("ipAddress")}>IP Address</th>
              <th className="px-4 py-3 text-left font-semibold border-b cursor-pointer" onClick={() => requestSort("deviceInfo")}>Device Info</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 9 : 6} className="px-4 py-6 text-center text-gray-500">No action history found.</td>
              </tr>
            ) : (
              sortedData.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition border-b last:border-b-0">
                  {isAdmin && (
                    <>
                      <td className="px-4 py-3 break-all">{item.userPublicId || "—"}</td>
                      <td className="px-4 py-3">{item.userEmail || "—"}</td>
                      <td className="px-4 py-3">{item.userRole || "—"}</td>
                    </>
                  )}
                  <td className="px-4 py-3">{item.timestamp ? new Date(item.timestamp).toLocaleString() : "—"}</td>
                  <td className="px-4 py-3 font-semibold text-blue-600">{item.actionType}</td>
                  <td className="px-4 py-3">{item.actionEntity}</td>
                  <td className="px-4 py-3 text-gray-700">{item.description}</td>
                  <td className="px-4 py-3">{item.ipAddress}</td>
                  <td className="px-4 py-3 max-w-sm truncate">{item.deviceInfo}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {sortedData.length === 0 ? (
          <p className="text-center text-gray-500">No action history found.</p>
        ) : (
          sortedData.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-4 border space-y-2">
              {isAdmin && (
                <>
                  <p><span className="font-medium">User ID:</span> {item.userPublicId || "—"}</p>
                  <p><span className="font-medium">Email:</span> {item.userEmail || "—"}</p>
                  <p><span className="font-medium">Role:</span> {item.userRole || "—"}</p>
                </>
              )}
              <p><span className="font-medium">Timestamp:</span> {item.timestamp ? new Date(item.timestamp).toLocaleString() : "—"}</p>
              <p><span className="font-medium">Action:</span> <span className="font-semibold text-blue-600">{item.actionType}</span></p>
              <p><span className="font-medium">Entity:</span> {item.actionEntity}</p>
              <p><span className="font-medium">Description:</span> {item.description}</p>
              <p><span className="font-medium">IP:</span> {item.ipAddress}</p>
              <p><span className="font-medium">Device:</span> {item.deviceInfo}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActionHistoryTable;
