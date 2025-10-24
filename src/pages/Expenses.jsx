//frontend\src\pages\Expenses.jsx
import React, { useState, useEffect } from "react";
import api from "../api"; 
import { CATEGORIES } from "../constants";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  Filler,
} from "chart.js";

Chart.register(LineController, LineElement, PointElement, Filler);

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    date: "",
    category: "",
    description: "",
    isRecurring: false,
    recurrenceInterval: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  //  Alerts
  const showAlert = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  //  Fetch all expenses
  const fetchExpenses = async () => {
    try {
      const res = await api.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error("❌ Error fetching expenses:", err);
      showAlert("⚠️ Failed to fetch expenses. Please log in again.", "error");
    }
  };

  //  Apply filters
  const fetchFilteredExpenses = async () => {
    try {
      const params = {};
      if (categoryFilter) params.category = categoryFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.get("/expenses", { params });
      setExpenses(res.data);
    } catch (err) {
      console.error("❌ Error filtering expenses:", err);
      showAlert("⚠️ Failed to apply filters.", "error");
    }
  };

  //  Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  //  Add or edit expense
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount || !form.date || !form.category) {
      showAlert("⚠️ Please fill in all required fields.", "warning");
      return;
    }

    try {
      if (editingId) {
        // Update expense
        const res = await api.put(`/expenses/${editingId}`, form);
        setExpenses(expenses.map((exp) => (exp._id === editingId ? res.data : exp)));
        showAlert("✅ Expense updated successfully!", "success");
      } else {
        // Add new expense
        const res = await api.post("/expenses", form);
        setExpenses([...expenses, res.data]);
        showAlert("✅ Expense added successfully!", "success");
      }

      // Reset form
      setEditingId(null);
      setForm({
        amount: "",
        date: "",
        category: "",
        description: "",
        isRecurring: false,
        recurrenceInterval: "",
      });

      // Notify Budget page
      localStorage.setItem("expenses_updated", Date.now().toString());
    } catch (err) {
      console.error("❌ Error saving expense:", err);
      showAlert("❌ Failed to save expense. Please log in again.", "error");
    }
  };

  //  Edit expense
  const handleEdit = (expense) => {
    setForm({
      amount: expense.amount,
      date: expense.date?.slice(0, 10),
      category: expense.category,
      description: expense.description,
      isRecurring: expense.isRecurring || false,
      recurrenceInterval: expense.recurrenceInterval || "",
    });
    setEditingId(expense._id);
  };

  // Delete expense
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(expenses.filter((exp) => exp._id !== id));
      showAlert("🗑️ Expense deleted successfully!", "info");
      localStorage.setItem("expenses_updated", Date.now().toString());
    } catch (err) {
      console.error("❌ Error deleting expense:", err);
      showAlert("❌ Failed to delete expense.", "error");
    }
  };

  return (
    <div className="p-6 text-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-emerald-400">
        {editingId ? "Edit Expense" : "Add Expense"}
      </h1>

      {/* 🔔 Alert Message */}
      {message && (
        <div
          className={`p-3 mb-4 rounded-lg text-center font-medium ${
            message.type === "success"
              ? "bg-emerald-700 text-white"
              : message.type === "error"
              ? "bg-red-700 text-white"
              : message.type === "warning"
              ? "bg-yellow-600 text-black"
              : "bg-blue-600 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 🔍 Filter Section */}
      <div className="flex flex-wrap gap-3 mb-6">
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
          className="p-2 bg-[#0F172A] border border-[#334155] rounded-lg text-gray-200"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 bg-[#0F172A] border border-[#334155] rounded-lg text-gray-200"
        />

        <button
          onClick={fetchFilteredExpenses}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-semibold"
        >
          Apply Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 🧾 Expense Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#1E293B] p-6 rounded-2xl shadow-lg border border-[#334155]"
        >
          <div className="mb-4">
            <label className="block mb-1 text-sm">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-[#0F172A] text-gray-200 border border-[#334155]"
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              className="p-2 rounded-lg bg-[#0F172A] text-gray-200 border border-[#334155]"
              required
            />
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="p-2 rounded-lg bg-[#0F172A] text-gray-200 border border-[#334155]"
              required
            />
          </div>

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full mb-4 p-2 rounded-lg bg-[#0F172A] text-gray-200 border border-[#334155]"
          ></textarea>

          {/* Recurring Expense */}
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              name="isRecurring"
              checked={form.isRecurring}
              onChange={handleChange}
            />
            <label>Recurring Expense</label>
          </div>

          {form.isRecurring && (
            <div className="mb-4">
              <label className="block mb-1 text-sm">Recurrence Interval</label>
              <select
                name="recurrenceInterval"
                value={form.recurrenceInterval}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-[#0F172A] text-gray-200 border border-[#334155]"
              >
                <option value="">Select interval</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg"
            >
              {editingId ? "Save Changes" : "Add Expense"}
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
                    isRecurring: false,
                    recurrenceInterval: "",
                  });
                }}
                className="flex-1 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/*  Expense Table */}
        <div className="bg-[#1E293B] p-6 rounded-2xl shadow-lg border border-[#334155] overflow-x-auto">
          <table className="w-full text-gray-300">
            <thead>
              <tr className="text-emerald-400 border-b border-[#334155]">
                <th className="py-2 text-left">Date</th>
                <th className="py-2 text-left">Category</th>
                <th className="py-2 text-left">Description</th>
                <th className="py-2 text-left">Amount</th>
                <th className="py-2 text-left">Recurring</th>
                <th className="py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length > 0 ? (
                expenses.map((exp) => (
                  <tr
                    key={exp._id}
                    className="border-b border-[#334155] hover:bg-[#0F172A]"
                  >
                    <td className="py-2">{exp.date?.slice(0, 10)}</td>
                    <td className="py-2">{exp.category}</td>
                    <td className="py-2">{exp.description || "—"}</td>
                    <td className="py-2 text-emerald-400 font-semibold">
                      ₹{exp.amount}
                    </td>
                    <td className="py-2">
                      {exp.isRecurring ? exp.recurrenceInterval : "—"}
                    </td>
                    <td className="py-2 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(exp)}
                        className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 rounded text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 rounded text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No expenses recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
