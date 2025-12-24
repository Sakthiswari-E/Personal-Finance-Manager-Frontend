// import React, { useEffect, useMemo, useState } from "react";
// import api from "../api";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend
// );

// export default function Income() {
//   const [income, setIncome] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch income (type = income)
//   const fetchIncome = async () => {
//     try {
//       const res = await api.get("/expenses?type=income");
//       setIncome(res.data || []);
//     } catch (err) {
//       console.error("❌ Income fetch error:", err);
//       setIncome([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchIncome();
//   }, []);

//   // Total Income
//   const totalIncome = useMemo(
//     () => income.reduce((sum, i) => sum + Number(i.amount || 0), 0),
//     [income]
//   );

//   // Monthly grouping
//   const monthlyIncome = useMemo(() => {
//     const map = {};
//     income.forEach((i) => {
//       const d = new Date(i.date);
//       const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
//       map[key] = (map[key] || 0) + Number(i.amount || 0);
//     });

//     return Object.entries(map)
//       .sort()
//       .map(([date, total]) => ({ date, total }));
//   }, [income]);

//   // Chart data
//   const chartData = {
//     labels: monthlyIncome.map((m) => m.date),
//     datasets: [
//       {
//         label: "Monthly Income (₹)",
//         data: monthlyIncome.map((m) => m.total),
//         borderColor: "#22c55e",
//         backgroundColor: "rgba(34,197,94,0.2)",
//         tension: 0.4,
//         fill: true,
//       },
//     ],
//   };

//   return (
//     <div className="min-h-screen p-8 bg-[#F0F2F5]">
//       <h1 className="text-3xl font-semibold mb-6 text-[#111B21]">
//         Income Overview
//       </h1>

//       {loading ? (
//         <p className="text-gray-500">Loading income data...</p>
//       ) : (
//         <>
//           {/* Summary */}
//           <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
//             <h2 className="text-lg font-medium text-gray-600">
//               Total Income
//             </h2>
//             <p className="text-3xl font-bold text-green-600 mt-2">
//               ₹{totalIncome.toLocaleString()}
//             </p>
//           </div>

//           {/* Chart */}
//           <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
//             <h2 className="text-lg font-medium mb-4 text-[#111B21]">
//               Income Growth
//             </h2>
//             {monthlyIncome.length ? (
//               <Line data={chartData} />
//             ) : (
//               <p className="text-gray-500">No income data available</p>
//             )}
//           </div>

//           {/* Income Table */}
//           <div className="bg-white p-6 rounded-xl shadow-sm">
//             <h2 className="text-lg font-medium mb-4 text-[#111B21]">
//               Income History
//             </h2>

//             {income.length === 0 ? (
//               <p className="text-gray-500">No income records found</p>
//             ) : (
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b text-gray-500">
//                     <th className="p-2 text-left">Date</th>
//                     <th className="p-2 text-left">Source</th>
//                     <th className="p-2 text-right">Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {income.map((i) => (
//                     <tr
//                       key={i._id}
//                       className="border-b hover:bg-gray-50"
//                     >
//                       <td className="p-2">
//                         {new Date(i.date).toLocaleDateString()}
//                       </td>
//                       <td className="p-2">
//                         {i.category || "Income"}
//                       </td>
//                       <td className="p-2 text-right text-green-600">
//                         ₹{Number(i.amount).toLocaleString()}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }














// import React, { useEffect, useState, useMemo } from "react";
// import { motion } from "framer-motion";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { TrendingUp, PlusCircle } from "lucide-react";
// import {
//   getIncome,
//   getIncomeSummary,
//   getMonthlyIncome,
// } from "../api/income";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend
// );

// export default function Income() {
//   const [income, setIncome] = useState([]);
//   const [monthly, setMonthly] = useState([]);
//   const [summary, setSummary] = useState({ total: 0 });
//   const [loading, setLoading] = useState(true);

//   // Fetch income data
//   const fetchIncomeData = async () => {
//     try {
//       const [incRes, sumRes, monRes] = await Promise.all([
//         getIncome(),
//         getIncomeSummary(),
//         getMonthlyIncome(),
//       ]);

//       setIncome(incRes.data || []);
//       setSummary(sumRes.data || { total: 0 });
//       setMonthly(monRes.data || []);
//     } catch (err) {
//       console.error("❌ Income fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchIncomeData();
//   }, []);

//   // Recent income
//   const recentIncome = useMemo(
//     () =>
//       [...income]
//         .sort((a, b) => new Date(b.date) - new Date(a.date))
//         .slice(0, 5),
//     [income]
//   );

//   // Chart data
//   const lineData = {
//     labels: monthly.map((m) => m.month),
//     datasets: [
//       {
//         label: "Monthly Income (₹)",
//         data: monthly.map((m) => m.total),
//         borderColor: "#22c55e",
//         backgroundColor: "rgba(34,197,94,0.15)",
//         tension: 0.4,
//         fill: true,
//       },
//     ],
//   };

//   if (loading) {
//     return <p className="p-6 text-[#667781]">Loading income data...</p>;
//   }

//   return (
//     <div className="min-h-screen p-8 bg-[#F0F2F5]">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-semibold text-[#111B21] flex items-center gap-2">
//           <TrendingUp className="text-[#22c55e]" /> Income
//         </h1>
//       </div>

//       {/* Summary */}
//       <motion.div
//         whileHover={{ scale: 1.03 }}
//         className="bg-white p-6 rounded-xl border shadow-sm mb-8"
//       >
//         <p className="text-[#667781] text-sm">Total Income</p>
//         <h2 className="text-3xl font-bold text-[#22c55e]">
//           ₹{summary.total?.toLocaleString()}
//         </h2>
//       </motion.div>

//       {/* Chart */}
//       <div className="bg-white p-6 rounded-xl border shadow-sm mb-10">
//         <h3 className="text-lg font-medium mb-4">Income Growth</h3>
//         {monthly.length ? (
//           <Line data={lineData} />
//         ) : (
//           <p className="text-sm text-[#667781]">No income trend yet</p>
//         )}
//       </div>

//       {/* Recent Income */}
//       <div className="bg-white p-6 rounded-xl border shadow-sm">
//         <h3 className="text-lg font-medium mb-4">Recent Income</h3>

//         {recentIncome.length === 0 ? (
//           <p className="text-[#667781]">No income records found</p>
//         ) : (
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b text-[#667781]">
//                 <th className="p-2 text-left">Date</th>
//                 <th className="p-2 text-left">Source</th>
//                 <th className="p-2 text-right">Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {recentIncome.map((i) => (
//                 <tr key={i._id} className="border-b hover:bg-[#F5F5F5]">
//                   <td className="p-2">
//                     {new Date(i.date).toLocaleDateString()}
//                   </td>
//                   <td className="p-2">{i.source}</td>
//                   <td className="p-2 text-right text-[#22c55e]">
//                     ₹{Number(i.amount).toLocaleString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* UX Guidance (MENTOR FIX ⭐) */}
//       <div className="mt-10 bg-[#E8F5E9] p-6 rounded-xl">
//         <h3 className="font-medium mb-2">💡 How to Increase Your Income</h3>
//         <ul className="text-sm text-[#3B4A54] list-disc pl-5">
//           <li>Add multiple income sources (freelance, part-time)</li>
//           <li>Track monthly income growth visually</li>
//           <li>Compare income vs expenses to improve savings</li>
//         </ul>
//       </div>
//     </div>
//   );
// }














import React, { useState, useEffect } from "react";
import api from "../api";

// ✅ Income categories (separate from expense categories)
const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Bonus",
  "Other",
];

export default function Income() {
  const [income, setIncome] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    date: "",
    category: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchIncome();
  }, []);

  // 🔔 Alerts
  const showAlert = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // 📥 Fetch income
  const fetchIncome = async () => {
    try {
      const res = await api.get("/income");
      setIncome(res.data);
    } catch (err) {
      console.error("❌ Error fetching income:", err);
      showAlert("⚠️ Failed to fetch income.", "error");
    }
  };

  // ✏️ Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ Add / ✏️ Update income
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount || !form.date || !form.category) {
      showAlert("⚠️ Please fill required fields.", "warning");
      return;
    }

    try {
      if (editingId) {
        const res = await api.put(`/income/${editingId}`, form);
        setIncome(
          income.map((inc) => (inc._id === editingId ? res.data : inc))
        );
        showAlert("✅ Income updated successfully!", "success");
      } else {
        const res = await api.post("/income", form);
        setIncome([...income, res.data]);
        showAlert("✅ Income added successfully!", "success");
      }

      setEditingId(null);
      setForm({
        amount: "",
        date: "",
        category: "",
        description: "",
      });

      // Notify dashboard
      localStorage.setItem("income_updated", Date.now().toString());
    } catch (err) {
      console.error("❌ Error saving income:", err);
      showAlert("❌ Failed to save income.", "error");
    }
  };

  // ✏️ Edit
  const handleEdit = (item) => {
    setForm({
      amount: item.amount,
      date: item.date?.slice(0, 10),
      category: item.category,
      description: item.description,
    });
    setEditingId(item._id);
  };

  // 🗑️ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this income?")) return;
    try {
      await api.delete(`/income/${id}`);
      setIncome(income.filter((i) => i._id !== id));
      showAlert("🗑️ Income deleted.", "info");
      localStorage.setItem("income_updated", Date.now().toString());
    } catch (err) {
      console.error("❌ Error deleting income:", err);
      showAlert("❌ Failed to delete income.", "error");
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: "#F0F2F5" }}>
      <h1 className="text-2xl font-bold mb-6">
        {editingId ? "Edit Income" : "Add Income"}
      </h1>

      {/* 🔔 Alert */}
      {message && (
        <div
          className="p-3 mb-4 rounded-lg text-center font-medium text-white"
          style={{
            backgroundColor:
              message.type === "success"
                ? "#24D366"
                : message.type === "error"
                ? "#ff4d4f"
                : message.type === "warning"
                ? "#fff3cd"
                : "#cfe2ff",
            color: message.type === "warning" ? "#111" : "#fff",
          }}
        >
          {message.text}
        </div>
      )}

      {/* 🧾 Income Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow mb-6"
      >
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        >
          <option value="">Select category</option>
          {INCOME_CATEGORIES.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="w-full py-2 rounded text-white font-semibold"
            style={{ backgroundColor: "#24D366" }}
          >
            {editingId ? "Save Changes" : "Add Income"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({
                  amount: "",
                  date: "",
                  category: "",
                  description: "",
                });
              }}
              className="w-full py-2 rounded bg-gray-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* 📊 Income Table */}
      <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-green-600">
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {income.length ? (
              income.map((i) => (
                <tr key={i._id} className="border-b hover:bg-gray-50">
                  <td>{i.date?.slice(0, 10)}</td>
                  <td>{i.category}</td>
                  <td>{i.description || "—"}</td>
                  <td className="font-semibold text-green-600">₹{i.amount}</td>
                  <td className="space-x-2">
                    <button
                      onClick={() => handleEdit(i)}
                      className="px-3 py-1 bg-blue-100 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(i._id)}
                      className="px-3 py-1 bg-red-100 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No income recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
