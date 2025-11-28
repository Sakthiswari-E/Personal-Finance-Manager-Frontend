// frontend/src/pages/Reports.jsx
import React, { useState, useEffect } from "react";
import { CATEGORIES } from "../constants";
import { FileDown, FileText } from "lucide-react";
import { Line, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";

Chart.register(...registerables);

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const showAlert = (message, type = "info") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  //  FIX: use correct backend endpoints
  const fetchSummary = async () => {
    try {
      setLoading(true);

      const params = {};
      if (categoryFilter && categoryFilter !== "All Categories")
        params.category = categoryFilter;
      if (startDate) params.startDate = new Date(startDate).toISOString();
      if (endDate) params.endDate = new Date(endDate).toISOString();

      console.log("📤 Sending filters:", params);

      //  FIXED WRONG ENDPOINT
      const { data } = await api.get("/reports/summary", { params });
      console.log("✅ Received data:", data);

      setSummary(data);
    } catch (error) {
      console.error("❌ Error fetching summary:", error);
      showAlert("Failed to load report data.", "error");
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [categoryFilter, startDate, endDate]);

  const exportCsv = async () => {
    try {
      //  FIXED EXPORT ROUTE
      const response = await api.get("/reports/export/csv", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "finance-report.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("❌ CSV Export Failed", err);
    }
  };

  const exportPdf = async () => {
    try {
      //  FIXED EXPORT ROUTE
      const response = await api.get("/reports/export/pdf", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "finance-report.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("❌ PDF Export Failed", err);
    }
  };

  // Correct filtered items
  const filteredItems =
    summary?.summary?.items?.filter((item) => {
      const date = new Date(item.date).toISOString().split("T")[0];
      const start = startDate || "0000-01-01";
      const end = endDate || "9999-12-31";
      const matchCategory = !categoryFilter || item.category === categoryFilter;
      const matchDate = date >= start && date <= end;
      return matchCategory && matchDate;
    }) || [];

  // Correct daily trend chart
  const dailyTrendData = {
    labels: summary?.summary?.dailyTrend?.map((d) => d.date) || [],
    datasets: [
      {
        label: "Daily Expenses (₹)",
        data: summary?.summary?.dailyTrend?.map((d) => d.total) || [],
        borderColor: "#14b8a6",
        backgroundColor: "rgba(20,184,166,0.3)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Correct category chart
  const categoryData = {
    labels: summary?.summary?.byCategory?.map((c) => c.category) || [],
    datasets: [
      {
        label: "Expenses by Category",
        data: summary?.summary?.byCategory?.map((c) => c.amount) || [],
        backgroundColor: [
          "#FF6B6B",
          "#FFD93D",
          "#6BCB77",
          "#4D96FF",
          "#FF9F1C",
          "#B983FF",
          "#38BDF8",
          "#F87171",
          "#A7F3D0",
          "#FACC15",
          "#60A5FA",
          "#FBBF24",
          "#C084FC",
          "#34D399",
          "#F472B6",
          "#A78BFA",
          "#FCD34D",
          "#818CF8",
          "#FCA5A5",
          "#FDE68A",
          "#86EFAC",
          "#93C5FD",
          "#E879F9",
          "#FDBA74",
          "#F9A8D4",
          "#BFDBFE",
          "#D9F99D",
          "#FDA4AF",
          "#99F6E4",
          "#E0E7FF",
        ],
      },
    ],
  };

  return (
    <div className="relative p-8 min-h-screen bg-[#F0F2F5] text-[#111B21] overflow-hidden">
      {/* ALERT */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg text-sm font-medium shadow
            z-50 ${
              alert.type === "success"
                ? "bg-[#24D366] text-white"
                : alert.type === "warning"
                ? "bg-yellow-500 text-white"
                : alert.type === "error"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {alert.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold text-[#111B21] mb-1">
          Financial Reports
        </h1>
        <p className="text-[#667781] text-sm">
          Analyze your expenses by category, time, and export insights.
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 bg-white border border-[#DCDCDC] rounded-lg text-[#3B4A54]"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div className="border rounded-xl px-4 bg-white flex items-center gap-6">
          {/* FROM */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">From</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-1.5 w-32 rounded-lg border border-gray-300"
            />
          </div>

          {/* TO */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">To</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-1.5 w-32 rounded-lg border border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* EXPORT BUTTONS */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 px-4 py-2 bg-[#24D366] hover:bg-[#1fbb59]
        text-white rounded-lg shadow"
        >
          <FileDown size={18} /> Export CSV
        </button>

        <button
          onClick={exportPdf}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600
        text-white rounded-lg shadow"
        >
          <FileText size={18} /> Export PDF
        </button>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-[#24D366] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : summary ? (
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* LINE CHART */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-4 rounded-lg border border-[#E6E6E6]"
          >
            <h2 className="text-lg font-semibold mb-2 text-[#111B21]">
              Daily Expense Trend
            </h2>
            <Line data={dailyTrendData} />
          </motion.div>

          {/* PIE CHART */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-4 rounded-lg border border-[#E6E6E6]"
          >
            <h2 className="text-lg font-semibold mb-2 text-[#111B21]">
              Expenses by Category
            </h2>
            <Pie data={categoryData} />
          </motion.div>
        </div>
      ) : (
        <motion.div
          className="text-center text-[#667781] py-16 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No data available. Try adjusting filters.
        </motion.div>
      )}

      {/* TABLE */}
      <motion.div
        key={filteredItems.length}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="overflow-x-auto bg-white rounded-lg p-4 border border-[#E6E6E6]"
      >
        <table className="w-full text-left text-[#3B4A54]">
          <thead>
            <tr className="border-b border-[#DCDCDC]">
              <th className="p-2">Date</th>
              <th className="p-2">Category</th>
              <th className="p-2">Description</th>
              <th className="p-2 text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((e, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-[#F0F2F5] hover:bg-[#F8FAFB]"
              >
                <td className="p-2">{new Date(e.date).toLocaleDateString()}</td>
                <td className="p-2">{e.category}</td>
                <td className="p-2">{e.description}</td>
                <td className="p-2 text-right">₹{e.amount.toFixed(2)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredItems.length === 0 && (
          <div className="text-center text-[#667781] p-4">
            No records found for selected filters.
          </div>
        )}
      </motion.div>
    </div>
  );
}
