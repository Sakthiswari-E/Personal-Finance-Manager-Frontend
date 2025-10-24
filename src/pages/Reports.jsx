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

  const filteredItems =
    summary?.items?.filter((item) => {
      const date = new Date(item.date).toISOString().split("T")[0];
      const start = startDate || "0000-01-01";
      const end = endDate || "9999-12-31";
      const matchCategory = !categoryFilter || item.category === categoryFilter;
      const matchDate = date >= start && date <= end;
      return matchCategory && matchDate;
    }) || [];

  const dailyTrendData = {
    labels: summary?.dailyTrend?.map((d) => d.date) || [],
    datasets: [
      {
        label: "Daily Expenses (₹)",
        data: summary?.dailyTrend?.map((d) => d.total) || [],
        borderColor: "#14b8a6",
        backgroundColor: "rgba(20,184,166,0.3)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const categoryData = {
    labels: summary?.byCategory?.map((c) => c.category) || [],
    datasets: [
      {
        label: "Expenses by Category",
        data: summary?.byCategory?.map((c) => c.amount) || [],
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
    <div className="relative p-8 min-h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg text-sm font-medium shadow-lg z-50 ${
              alert.type === "success"
                ? "bg-green-600/90"
                : alert.type === "warning"
                ? "bg-yellow-600/90"
                : alert.type === "error"
                ? "bg-red-600/90"
                : "bg-blue-600/90"
            }`}
          >
            {alert.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold text-teal-400 mb-2">
          Financial Reports
        </h1>
        <p className="text-gray-400 text-sm">
          Analyze your expenses by category, time, and export insights.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 bg-[#0F172A] border border-[#334155] rounded-lg text-gray-200"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 rounded-lg bg-[#0F172A] text-gray-200 border border-[#334155]"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 rounded-lg bg-[#0F172A] text-gray-200 border border-[#334155]"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          <FileDown size={18} /> Export CSV
        </button>
        <button
          onClick={exportPdf}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
        >
          <FileText size={18} /> Export PDF
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : summary ? (
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#0F172A] p-4 rounded-lg border border-[#334155]"
          >
            <h2 className="text-lg font-semibold mb-2 text-teal-400">
              Daily Expense Trend
            </h2>
            <Line data={dailyTrendData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#0F172A] p-4 rounded-lg border border-[#334155]"
          >
            <h2 className="text-lg font-semibold mb-2 text-teal-400">
              Expenses by Category
            </h2>
            <Pie data={categoryData} />
          </motion.div>
        </div>
      ) : (
        <motion.div
          className="text-center text-gray-400 py-16 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No data available. Try adjusting filters.
        </motion.div>
      )}

      <motion.div
        key={filteredItems.length}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="overflow-x-auto bg-[#0F172A] rounded-lg p-4 border border-[#334155]"
      >
        <table className="w-full text-left text-gray-300">
          <thead>
            <tr className="border-b border-gray-700">
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
                className="border-b border-gray-800 hover:bg-gray-800/40"
              >
                <td className="p-2">
                  {new Date(e.date).toLocaleDateString()}
                </td>
                <td className="p-2">{e.category}</td>
                <td className="p-2">{e.description}</td>
                <td className="p-2 text-right">₹{e.amount.toFixed(2)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredItems.length === 0 && (
          <div className="text-center text-gray-500 p-4">
            No records found for selected filters.
          </div>
        )}
      </motion.div>
    </div>
  );
}
