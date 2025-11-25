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
        toast.success(" Budget updated!");
      } else {
        await api.post("/budgets", normalizedForm);
        toast.success(" Budget added!");
      }

      setModalOpen(false);
      setForm({ category: "", amount: "", period: "monthly" });
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(" Failed to save budget.");
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
      toast.error(" Failed to delete budget.");
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
  <div
    className="min-h-screen p-8"
    style={{ backgroundColor: "#F0F2F5", color: "#3B4A54" }}
  >
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-3xl font-bold"
          style={{ color: "#111B21" }}
        >
          Budgets
        </h1>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 rounded-lg border shadow-sm"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#DCDCDC",
            color: "#3B4A54",
          }}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div
        className="rounded-2xl p-6 mb-8 shadow"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #DCDCDC" }}
      >
        <div className="grid md:grid-cols-3 text-center gap-4">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "#111B21" }}>
              Total Budget
            </h2>
            <p className="text-2xl font-bold" style={{ color: "#111B21" }}>
              {formatINR(totalBudget)}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold" style={{ color: "#111B21" }}>
              Total Spent
            </h2>
            <p className="text-2xl font-bold" style={{ color: "#ff4d4f" }}>
              {formatINR(totalSpent)}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold" style={{ color: "#111B21" }}>
              Remaining
            </h2>
            <p
              className={`text-2xl font-bold ${
                remaining < 0 ? "text-red-500" : "text-green-600"
              }`}
            >
              {formatINR(remaining)}
            </p>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div
        className="rounded-2xl p-6 mb-8 shadow"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #DCDCDC" }}
      >
        <h2
          className="text-xl font-semibold text-center mb-4"
          style={{ color: "#111B21" }}
        >
          Spending by Category
        </h2>

        {filteredBudgets.length === 0 ||
        pieData.every((p) => p.value === 0) ? (
          <p className="text-center py-20" style={{ color: "#667781" }}>
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
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => `₹${v.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #DCDCDC",
                    color: "#111B21",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add New */}
        <button
          onClick={() => {
            setEditing(null);
            setForm({ category: "", amount: "", period: "monthly" });
            setModalOpen(true);
          }}
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer"
          style={{
            borderColor: "#24D366",
            backgroundColor: "#FFFFFF",
          }}
        >
          <PlusCircle size={36} className="text-[#24D366] mb-2" />
          <p style={{ color: "#24D366" }}>Add New Budget</p>
        </button>

        {filteredBudgets.map((b) => {
          const spent = getSpent(b.category);
          const percent = Math.min((spent / b.amount) * 100, 100);
          const over = spent > b.amount;
          const near = spent >= b.amount * 0.9 && !over;

          return (
            <div
              key={b._id}
              className="p-5 rounded-2xl border shadow"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: over
                  ? "#ffcccc"
                  : near
                  ? "#ffe9a8"
                  : "#DCDCDC",
              }}
            >
              <div className="flex justify-between mb-3">
                <h3 className="text-lg font-semibold" style={{ color: "#111B21" }}>
                  {b.category}
                </h3>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(b)}
                    className="px-3 py-1.5 rounded text-sm"
                    style={{
                      backgroundColor: "#24D366",
                      color: "#FFFFFF",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(b._id)}
                    className="px-3 py-1.5 rounded text-sm"
                    style={{
                      backgroundColor: "#ffdddd",
                      color: "#111B21",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p style={{ color: "#667781" }} className="text-sm mb-2">
                ₹{spent} spent of ₹{b.amount}
              </p>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="h-3 rounded-full"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: over
                      ? "#ff4d4f"
                      : near
                      ? "#ffcc00"
                      : "#24D366",
                  }}
                ></div>
              </div>

              {over && (
                <p className="text-red-600 text-xs">⚠️ Budget exceeded!</p>
              )}

              {near && !over && (
                <p className="text-yellow-600 text-xs">
                  ⚠️ You’re close to your limit.
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setModalOpen(false)}
            />

            <motion.form
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onSubmit={handleSubmit}
              className="relative z-10 w-full max-w-md p-6 rounded-lg shadow-lg"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #DCDCDC",
              }}
            >
              <h3
                className="text-xl font-semibold mb-4"
                style={{ color: "#111B21" }}
              >
                {editing ? "Edit Budget" : "Add Budget"}
              </h3>

              {/* Inputs */}
              <div className="grid gap-4">
                <div>
                  <label className="text-sm" style={{ color: "#667781" }}>
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 rounded border"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#DCDCDC",
                      color: "#3B4A54",
                    }}
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
                  <label className="text-sm" style={{ color: "#667781" }}>
                    Amount (₹)
                  </label>
                  <input
                    name="amount"
                    type="number"
                    value={form.amount}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 rounded border"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#DCDCDC",
                      color: "#3B4A54",
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm" style={{ color: "#667781" }}>
                    Period
                  </label>
                  <select
                    name="period"
                    value={form.period}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 rounded border"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#DCDCDC",
                      color: "#3B4A54",
                    }}
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
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: "#E6E6E6",
                    color: "#111B21",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: "#24D366",
                    color: "#FFFFFF",
                  }}
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