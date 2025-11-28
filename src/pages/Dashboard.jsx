// frontend/src/pages/Dashboard.jsx
import React, { useContext, useMemo, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import { Target, Wallet, BarChart3, LogOut } from "lucide-react";
import NotificationsDropdown from "../components/NotificationsDropdown";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const COLORS = [
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
];

export default function Dashboard() {
  const { goals, expenses, loading, refreshData } = useContext(AppContext);
  const { user, logout } = useAuth();

  const [trend, setTrend] = useState([]);
  const [categories, setCategories] = useState([]);

  //  Derived totals
  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0),
    [expenses]
  );

  const totalSaved = useMemo(
    () => goals.reduce((sum, g) => sum + Number(g.saved || 0), 0),
    [goals]
  );

  const totalTargets = useMemo(
    () => goals.reduce((sum, g) => sum + Number(g.target || 0), 0),
    [goals]
  );

  const progress =
    totalTargets > 0 ? ((totalSaved / totalTargets) * 100).toFixed(1) : 0;

  // Fetch reports correctly
  const fetchReports = async () => {
    try {
      const res = await api.get("/reports/summary");
      const data = res.data || {};

      // setTrend(Array.isArray(data.dailyTrend) ? data.dailyTrend : []);
      setTrend(Array.isArray(data.trend) ? data.trend : []);

      setCategories(
        Array.isArray(data.byCategory)
          ? data.byCategory.map((item) => ({
              name: item.category || "Uncategorized",
              value:
                item.amount !== undefined
                  ? item.amount
                  : item.total !== undefined
                  ? item.total
                  : 0,
            }))
          : []
      );
    } catch (err) {
      console.error(
        "❌ Dashboard report fetch error:",
        err.response?.data || err.message
      );
      setTrend([]);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [expenses]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (["expenses_updated", "goals_updated"].includes(e.key)) {
        refreshData();
        fetchReports();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const lineData = {
    labels: trend.map((t) => {
      const cleaned = t.date.replace("/", "-").trim();
      const parts = cleaned.split("-");

      let year = parts[0];
      let month = parts[1] || "01"; // fallback if month is missing

      const dateObj = new Date(year, month - 1);

      return dateObj.toLocaleDateString("en-GB", {
        month: "short",
        year: "2-digit",
      });
    }),

    datasets: [
      {
        label: "Expenses (₹)",
        data: trend.map((t) => t.total || 0),
        borderColor: "#14b8a6",
        backgroundColor: "rgba(20,184,166,0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const pieData = {
    labels: categories.map((c) => c.name),
    datasets: [
      {
        data: categories.map((c) => c.value),
        backgroundColor: COLORS,
        hoverOffset: 6,
      },
    ],
  };

  const recentTransactions = useMemo(
    () =>
      [...expenses]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5),
    [expenses]
  );

  return (
    <div className="min-h-screen p-8 bg-[#F0F2F5] text-[#111B21]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#111B21]">Dashboard</h1>
          {user && (
            <p className="text-[#667781] text-sm mt-1">
              Welcome,{" "}
              <span className="text-[#111B21] font-medium">
                {user.name || user.email}
              </span>{" "}
              👋
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 relative">
          <NotificationsDropdown />

          {/* Refresh Button */}
          <button
            onClick={() => {
              refreshData();
              fetchReports();
            }}
            className="px-4 py-2 bg-[#24D366] text-white hover:bg-[#1eb85a] rounded-lg text-sm font-medium transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40 text-[#667781]">
          Loading dashboard...
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Total Expenses */}
            <motion.div
              whileHover={{ scale: 1.04 }}
              className="bg-white p-5 rounded-xl border border-[#E6E6E6] shadow-sm"
            >
              <div className="flex items-center gap-3 text-[#24D366]">
                <Wallet size={20} />
                <h2 className="font-medium text-lg text-[#111B21]">
                  Total Expenses
                </h2>
              </div>
              <p className="text-2xl font-semibold text-[#111B21] mt-2">
                ₹{totalExpenses.toLocaleString()}
              </p>
            </motion.div>

            {/* Goals Progress */}
            <motion.div
              whileHover={{ scale: 1.04 }}
              className="bg-white p-5 rounded-xl border border-[#E6E6E6] shadow-sm"
            >
              <div className="flex items-center gap-3 text-[#24D366]">
                <Target size={20} />
                <h2 className="font-medium text-lg text-[#111B21]">
                  Goals Progress
                </h2>
              </div>
              <p className="text-2xl font-semibold text-[#111B21] mt-2">
                {progress}%
              </p>
              <p className="text-sm text-[#667781]">
                ₹{totalSaved.toLocaleString()} saved / ₹
                {totalTargets.toLocaleString()} target
              </p>
            </motion.div>

            {/* Active Goals */}
            <motion.div
              whileHover={{ scale: 1.04 }}
              className="bg-white p-5 rounded-xl border border-[#E6E6E6] shadow-sm"
            >
              <div className="flex items-center gap-3 text-[#24D366]">
                <BarChart3 size={20} />
                <h2 className="font-medium text-lg text-[#111B21]">
                  Active Goals
                </h2>
              </div>
              <p className="text-2xl font-semibold text-[#111B21] mt-2">
                {goals.length}
              </p>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Line Chart */}
            <div className="col-span-2 bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-sm">
              <h2 className="text-lg font-medium mb-4 text-[#111B21]">
                Expense Trend
              </h2>
              <div className="h-64">
                {trend.length ? (
                  <Line
                    data={lineData}
                    options={{
                      responsive: true,
                      plugins: { legend: { display: false } },
                      scales: {
                        x: { grid: { color: "#E6E6E6" } },
                        y: { grid: { color: "#E6E6E6" } },
                      },
                    }}
                  />
                ) : (
                  <p className="text-[#667781] text-sm">
                    No expense trend data
                  </p>
                )}
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-sm">
              <h2 className="text-lg font-medium mb-4 text-[#111B21]">
                Spending by Category
              </h2>
              <div className="h-64 flex items-center justify-center">
                {categories.length ? (
                  <Pie
                    data={pieData}
                    options={{
                      responsive: true,
                      plugins: { legend: { position: "bottom" } },
                    }}
                  />
                ) : (
                  <p className="text-[#667781] text-sm">No category data</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-sm">
            <h3 className="text-lg font-medium mb-4 text-[#24D366]">
              Recent Transactions
            </h3>

            {expenses.length === 0 ? (
              <p className="text-[#667781]">No expenses found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-[#667781] border-b border-[#E6E6E6]">
                      <th className="p-2">Date</th>
                      <th className="p-2">Category</th>
                      <th className="p-2">Description</th>
                      <th className="p-2 text-right">Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentTransactions.map((e) => (
                      <tr
                        key={e._id}
                        className="border-b border-[#E6E6E6] hover:bg-[#F5F5F5] transition"
                      >
                        <td className="p-2 text-[#3B4A54]">
                          {e.date ? new Date(e.date).toLocaleDateString() : "—"}
                        </td>
                        <td className="p-2 text-[#3B4A54]">{e.category}</td>
                        <td className="p-2 text-[#667781]">
                          {e.description || "—"}
                        </td>
                        <td className="p-2 text-right text-[#24D366]">
                          ₹{Number(e.amount).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
