import React, { useEffect, useState } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit, PlusCircle } from "lucide-react";
import { CATEGORIES } from "../constants";
import { toast } from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    category: "",
    amount: "",
    period: "monthly",
  });
  const [submitting, setSubmitting] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");

  //  Fetch budgets + expenses
  const fetchData = async () => {
    try {
      setLoading(true);
      const [bRes, eRes] = await Promise.all([
        api.get("/budgets"),
        api.get("/expenses"),
      ]);
      setBudgets(bRes.data || []);
      setExpenses(eRes.data || []);
    } catch (err) {
      console.error("Error loading data:", err);
      toast.error("Failed to load data!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // 🔁 Listen for expense changes from Expenses page
    const listener = () => fetchData();
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  //  Case-insensitive + trimmed match for spending calc
  const getSpent = (category) => {
    if (!category) return 0;
    return expenses
      .filter(
        (e) =>
          e.category &&
          e.category.trim().toLowerCase() === category.trim().toLowerCase()
      )
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add/Edit Budget
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.amount) {
      toast("⚠️ Please fill all fields.", { icon: "⚠️" });
      return;
    }

    const normalizedForm = {
      ...form,
      category: form.category.trim(),
    };

    try {
      setSubmitting(true);
      if (editing) {
        await api.put(`/budgets/${editing._id}`, normalizedForm);
        toast.success("✅ Budget updated!");
      } else {
        await api.post("/budgets", normalizedForm);
        toast.success("✅ Budget added!");
      }

      setModalOpen(false);
      setForm({ category: "", amount: "", period: "monthly" });
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to save budget.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (b) => {
    setEditing(b);
    setForm({
      category: b.category,
      amount: b.amount,
      period: b.period || "monthly",
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this budget?")) return;
    try {
      await api.delete(`/budgets/${id}`);
      toast("🗑️ Budget deleted.", { icon: "🗑️" });
      fetchData();
    } catch {
      toast.error("❌ Failed to delete budget.");
    }
  };

  //  Totals
  const totalBudget = budgets.reduce(
    (sum, b) => sum + Number(b.amount || 0),
    0
  );
  const totalSpent = budgets.reduce((sum, b) => sum + getSpent(b.category), 0);
  const remaining = totalBudget - totalSpent;
  const formatINR = (n) => `₹${Number(n || 0).toLocaleString()}`;

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

  const filteredBudgets = categoryFilter
    ? budgets.filter(
        (b) =>
          b.category &&
          b.category.trim().toLowerCase() ===
            categoryFilter.trim().toLowerCase()
      )
    : budgets;

  const pieData = filteredBudgets.map((b) => ({
    name: b.category,
    value: getSpent(b.category),
  }));

  return (
    <div className="min-h-screen p-8 text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/*  Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-teal-400">Budgets</h1>
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
        </div>

        {/*  Summary */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="grid md:grid-cols-3 text-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-teal-400">
                Total Budget
              </h2>
              <p className="text-2xl font-bold text-gray-200">
                {formatINR(totalBudget)}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-teal-400">
                Total Spent
              </h2>
              <p className="text-2xl font-bold text-red-400">
                {formatINR(totalSpent)}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-teal-400">
                Remaining
              </h2>
              <p
                className={`text-2xl font-bold ${
                  remaining < 0 ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {formatINR(remaining)}
              </p>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold text-center text-teal-400 mb-4">
            Spending by Category
          </h2>

          {filteredBudgets.length === 0 ||
          pieData.every((p) => p.value === 0) ? (
            <p className="text-center text-gray-500 py-20">
              No spending data yet.
            </p>
          ) : (
            <div className="flex justify-center items-center h-72">
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={120}
                    innerRadius={70}
                    paddingAngle={4}
                    label={({ name, value }) => `${name}: ₹${value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => `₹${v.toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Budget Cards */}
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ➕ Add Budget */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-teal-500 rounded-2xl bg-[#0f172a] cursor-pointer hover:bg-[#0b1220]/80 transition"
              onClick={() => {
                setEditing(null);
                setForm({ category: "", amount: "", period: "monthly" });
                setModalOpen(true);
              }}
            >
              <PlusCircle size={36} className="text-teal-400 mb-2" />
              <p className="text-teal-400 font-medium">Add New Budget</p>
            </motion.div>

            {/*  Budget List */}
            {filteredBudgets.map((b) => {
              const spent = getSpent(b.category);
              const percent = Math.min((spent / b.amount) * 100, 100);
              const overLimit = spent > b.amount;
              const nearLimit = spent >= b.amount * 0.9 && !overLimit;

              return (
                <motion.div
                  key={b._id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-5 rounded-2xl border shadow-lg transition ${
                    overLimit
                      ? "border-red-500 bg-[#1a0b0b]"
                      : nearLimit
                      ? "border-yellow-500 bg-[#1a1a0b]"
                      : "border-gray-800 bg-[#111827]"
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-200">
                      {b.category}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(b)}
                        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm transition"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm transition"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-2">
                    ₹{spent} spent of ₹{b.amount}
                  </p>

                  <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        overLimit
                          ? "bg-red-500"
                          : nearLimit
                          ? "bg-yellow-500"
                          : "bg-teal-500"
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>

                  {overLimit && (
                    <p className="text-red-400 text-xs mt-1">
                      ⚠️ You’ve exceeded your budget!
                    </p>
                  )}
                  {nearLimit && !overLimit && (
                    <p className="text-yellow-400 text-xs mt-1">
                      ⚠️ You’re close to your budget limit.
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/*  Modal */}
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setModalOpen(false)}
              />
              <motion.form
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                onSubmit={handleSubmit}
                className="relative z-10 bg-[#0F172A] w-full max-w-md p-6 rounded-lg border border-[#334155]"
              >
                <h3 className="text-xl font-semibold text-gray-100 mb-4">
                  {editing ? "Edit Budget" : "Add Budget"}
                </h3>

                <div className="grid gap-3">
                  <div>
                    <label className="text-sm text-gray-300">Category</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full p-2 mt-1 rounded bg-[#0b1220] border border-[#1f2a44] text-gray-100"
                    >
                      <option value="">Select Category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-300">Amount (₹)</label>
                    <input
                      name="amount"
                      type="number"
                      value={form.amount}
                      onChange={handleChange}
                      className="w-full p-2 mt-1 rounded bg-[#0b1220] border border-[#1f2a44] text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-300">Period</label>
                    <select
                      name="period"
                      value={form.period}
                      onChange={handleChange}
                      className="w-full p-2 mt-1 rounded bg-[#0b1220] border border-[#1f2a44] text-gray-100"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-6 gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded text-white"
                  >
                    {submitting ? "Saving..." : editing ? "Update" : "Add"}
                  </button>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
