import React from "react";

export default function Reports() {
  const token = localStorage.getItem("token");
  const base = "http://localhost:5001/api/export";

  const handleExport = (path) => {
    window.open(`${base}/${path}?token=${token}`, "_blank");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        📤 Export Your Financial Data
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={() => handleExport("expenses/csv")}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg"
        >
          Export Expenses (CSV)
        </button>
        <button
          onClick={() => handleExport("budgets/csv")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg"
        >
          Export Budgets (CSV)
        </button>
        <button
          onClick={() => handleExport("goals/csv")}
          className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg"
        >
          Export Goals (CSV)
        </button>
        <button
          onClick={() => handleExport("report/pdf")}
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg"
        >
          Download Full Report (PDF)
        </button>
        <button
          onClick={() => handleExport("all/zip")}
          className="bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 rounded-lg"
        >
          Export Everything (ZIP)
        </button>
      </div>
    </div>
  );
}
