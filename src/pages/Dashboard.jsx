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
  "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#FF9F1C",
  "#B983FF", "#38BDF8", "#F87171", "#A7F3D0", "#FACC15",
  "#60A5FA", "#FBBF24", "#C084FC", "#34D399", "#F472B6",
  "#A78BFA", "#FCD34D", "#818CF8", "#FCA5A5", "#FDE68A",
  "#86EFAC", "#93C5FD", "#E879F9", "#FDBA74", "#F9A8D4",
  "#BFDBFE", "#D9F99D", "#FDA4AF", "#99F6E4", "#E0E7FF",
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

  const progress = totalTargets > 0 ? ((totalSaved / totalTargets) * 100).toFixed(1) : 0;


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
            // value: item.total || 0,
            value: item.amount || item.total || 0

          }))
        : []
    );
  } catch (err) {
    console.error("❌ Dashboard report fetch error:", err.response?.data || err.message);
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

  // Chart configs
  const lineData = {
    labels: trend.map((t) =>
      new Date(t.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      })
    ),
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

  // return (
  //   <div className="min-h-screen p-8 text-gray-100 bg-gray-900">
  //     {/* Header */}
  //     <div className="flex justify-between items-center mb-8">
  //       <div>
  //         <h1 className="text-3xl font-semibold text-teal-400">Dashboard</h1>
  //         {user && (
  //           <p className="text-gray-400 text-sm mt-1">
  //             Welcome,{" "}
  //             <span className="text-white font-medium">
  //               {user.name || user.email}
  //             </span>{" "}
  //             👋
  //           </p>
  //         )}
  //       </div>
  //       <div className="flex items-center gap-3">
  //         <button
  //           onClick={() => {
  //             refreshData();
  //             fetchReports();
  //           }}
  //           className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-sm font-medium transition"
  //         >
  //           Refresh
  //         </button>
  //       </div>
  //     </div>

  //     {loading ? (
  //       <div className="flex justify-center items-center h-40 text-gray-400">
  //         Loading dashboard...
  //       </div>
  //     ) : (
  //       <>
  //         {/* Summary Cards */}
  //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
  //           {/* Total Expenses */}
  //           <motion.div
  //             whileHover={{ scale: 1.05 }}
  //             className="bg-[#111827] p-5 rounded-xl border border-gray-800 shadow-md"
  //           >
  //             <div className="flex items-center gap-3 text-teal-400">
  //               <Wallet size={20} />
  //               <h2 className="font-medium text-lg">Total Expenses</h2>
  //             </div>
  //             <p className="text-2xl font-semibold text-white mt-2">
  //               ₹{totalExpenses.toLocaleString()}
  //             </p>
  //           </motion.div>

  //           {/* Goals Progress */}
  //           <motion.div
  //             whileHover={{ scale: 1.05 }}
  //             className="bg-[#111827] p-5 rounded-xl border border-gray-800 shadow-md"
  //           >
  //             <div className="flex items-center gap-3 text-teal-400">
  //               <Target size={20} />
  //               <h2 className="font-medium text-lg">Goals Progress</h2>
  //             </div>
  //             <p className="text-2xl font-semibold text-white mt-2">{progress}%</p>
  //             <p className="text-sm text-gray-400">
  //               ₹{totalSaved.toLocaleString()} saved / ₹
  //               {totalTargets.toLocaleString()} target
  //             </p>
  //           </motion.div>

  //           {/* Active Goals */}
  //           <motion.div
  //             whileHover={{ scale: 1.05 }}
  //             className="bg-[#111827] p-5 rounded-xl border border-gray-800 shadow-md"
  //           >
  //             <div className="flex items-center gap-3 text-teal-400">
  //               <BarChart3 size={20} />
  //               <h2 className="font-medium text-lg">Active Goals</h2>
  //             </div>
  //             <p className="text-2xl font-semibold text-white mt-2">
  //               {goals.length}
  //             </p>
  //           </motion.div>
  //         </div>

  //         {/* Charts */}
  //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
  //           {/* Line Chart */}
  //           <div className="col-span-2 bg-[#111827] p-6 rounded-2xl border border-gray-800 shadow-lg">
  //             <h2 className="text-lg font-medium mb-4 text-gray-200">
  //               Expense Trend
  //             </h2>
  //             <div className="h-64">
  //               {trend.length ? (
  //                 <Line
  //                   data={lineData}
  //                   options={{
  //                     responsive: true,
  //                     plugins: { legend: { display: false } },
  //                     scales: {
  //                       x: { grid: { color: "#1f2937" } },
  //                       y: { grid: { color: "#1f2937" } },
  //                     },
  //                   }}
  //                 />
  //               ) : (
  //                 <p className="text-gray-500 text-sm">No expense trend data</p>
  //               )}
  //             </div>
  //           </div>

  //           {/* Pie Chart */}
  //           <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800 shadow-lg">
  //             <h2 className="text-lg font-medium mb-4 text-gray-200">
  //               Spending by Category
  //             </h2>
  //             <div className="h-64 flex items-center justify-center">
  //               {categories.length ? (
  //                 <Pie
  //                   data={pieData}
  //                   options={{
  //                     responsive: true,
  //                     plugins: { legend: { position: "bottom" } },
  //                   }}
  //                 />
  //               ) : (
  //                 <p className="text-gray-500 text-sm">No category data</p>
  //               )}
  //             </div>
  //           </div>
  //         </div>

  //         {/* Recent Transactions */}
  //         <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800 shadow-lg">
  //           <h3 className="text-lg font-medium mb-4 text-teal-400">
  //             Recent Transactions
  //           </h3>
  //           {expenses.length === 0 ? (
  //             <p className="text-gray-400">No expenses found.</p>
  //           ) : (
  //             <div className="overflow-x-auto">
  //               <table className="w-full text-left text-sm">
  //                 <thead>
  //                   <tr className="text-gray-400 border-b border-gray-800">
  //                     <th className="p-2">Date</th>
  //                     <th className="p-2">Category</th>
  //                     <th className="p-2">Description</th>
  //                     <th className="p-2 text-right">Amount</th>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
  //                   {recentTransactions.map((e) => (
  //                     <tr
  //                       key={e._id}
  //                       className="border-b border-gray-800 hover:bg-gray-800/40 transition"
  //                     >
  //                       <td className="p-2 text-gray-300">
  //                         {e.date
  //                           ? new Date(e.date).toLocaleDateString()
  //                           : "—"}
  //                       </td>
  //                       <td className="p-2 text-gray-300">{e.category}</td>
  //                       <td className="p-2 text-gray-400">
  //                         {e.description || "—"}
  //                       </td>
  //                       <td className="p-2 text-right text-teal-400">
  //                         ₹{Number(e.amount).toLocaleString()}
  //                       </td>
  //                     </tr>
  //                   ))}
  //                 </tbody>
  //               </table>
  //             </div>
  //           )}
  //         </div>
  //       </>
  //     )}
  //   </div>
  // );











  return (
  <div className="min-h-screen p-8 text-gray-800 bg-gradient-to-b from-[#E6E3E3] via-[#F6D1C1] to-[#E6E3E3]">

    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-semibold text-[#F6D1C1]">Dashboard</h1>
        {user && (
          <p className="text-gray-700 text-sm mt-1">
            Welcome,{" "}
            <span className="font-medium text-gray-800">
              {user.name || user.email}
            </span>{" "}
            👋
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            refreshData();
            fetchReports();
          }}
          className="px-4 py-2 bg-[#F6D1C1] hover:bg-[#eab7a1] rounded-lg text-sm font-medium transition text-gray-800"
        >
          Refresh
        </button>
      </div>
    </div>

    {loading ? (
      <div className="flex justify-center items-center h-40 text-gray-600">
        Loading dashboard...
      </div>
    ) : (
      <>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Total Expenses */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-5 rounded-xl bg-white/70 backdrop-blur-xl border border-[#E6E3E3] shadow"
          >
            <div className="flex items-center gap-3 text-[#F6D1C1]">
              <Wallet size={20} />
              <h2 className="font-medium text-lg text-gray-800">Total Expenses</h2>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              ₹{totalExpenses.toLocaleString()}
            </p>
          </motion.div>

          {/* Goals Progress */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-5 rounded-xl bg-white/70 backdrop-blur-xl border border-[#E6E3E3] shadow"
          >
            <div className="flex items-center gap-3 text-[#F6D1C1]">
              <Target size={20} />
              <h2 className="font-medium text-lg text-gray-800">Goals Progress</h2>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{progress}%</p>
            <p className="text-sm text-gray-600">
              ₹{totalSaved.toLocaleString()} saved / ₹{totalTargets.toLocaleString()} target
            </p>
          </motion.div>

          {/* Active Goals */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-5 rounded-xl bg-white/70 backdrop-blur-xl border border-[#E6E3E3] shadow"
          >
            <div className="flex items-center gap-3 text-[#F6D1C1]">
              <BarChart3 size={20} />
              <h2 className="font-medium text-lg text-gray-800">Active Goals</h2>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{goals.length}</p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

          {/* Line Chart */}
          <div className="col-span-2 p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-[#E6E3E3] shadow">
            <h2 className="text-lg font-medium mb-4 text-gray-800">
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
                      x: { grid: { color: "#E6E3E3" } },
                      y: { grid: { color: "#E6E3E3" } },
                    },
                  }}
                />
              ) : (
                <p className="text-gray-600 text-sm">No expense trend data</p>
              )}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-[#E6E3E3] shadow">
            <h2 className="text-lg font-medium mb-4 text-gray-800">
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
                <p className="text-gray-600 text-sm">No category data</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-[#E6E3E3] shadow">
          <h3 className="text-lg font-medium mb-4 text-[#F6D1C1]">
            Recent Transactions
          </h3>

          {expenses.length === 0 ? (
            <p className="text-gray-600">No expenses found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-600 border-b border-[#E6E3E3]">
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
                      className="border-b border-[#E6E3E3] hover:bg-[#F6D1C1]/20 transition"
                    >
                      <td className="p-2 text-gray-800">
                        {e.date ? new Date(e.date).toLocaleDateString() : "—"}
                      </td>
                      <td className="p-2 text-gray-800">{e.category}</td>
                      <td className="p-2 text-gray-600">
                        {e.description || "—"}
                      </td>
                      <td className="p-2 text-right text-[#F6D1C1]">
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
