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
  // Apply filters
  const fetchFilteredExpenses = async () => {
    try {
      const body = {
        category: categoryFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };

      const res = await api.post("/expenses/filter", body);
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
        setExpenses(
          expenses.map((exp) => (exp._id === editingId ? res.data : exp))
        );
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
    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;
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
    <div
      className="p-6"
      style={{ backgroundColor: "#F0F2F5", color: "#3B4A54" }}
    >
      <h1 className="text-2xl font-bold mb-6" style={{ color: "#111B21" }}>
        {editingId ? "Edit Expense" : "Add Expense"}
      </h1>

      {/* 🔔 Alert Message */}
      {message && (
        <div
          className={`p-3 mb-4 rounded-lg text-center font-medium`}
          style={{
            backgroundColor:
              message.type === "success"
                ? "#24D366"
                : message.type === "error"
                ? "#ff4d4f"
                : message.type === "warning"
                ? "#fff3cd"
                : "#cfe2ff",
            color: message.type === "warning" ? "#111B21" : "#ffffff",
          }}
        >
          {message.text}
        </div>
      )}

      {/* 🔍 Filter Section */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 rounded-lg border"
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

        <button
          onClick={fetchFilteredExpenses}
          className="px-4 py-2 rounded-lg font-semibold"
          style={{
            backgroundColor: "#24D366",
            color: "#FFFFFF",
          }}
        >
          Apply Filters
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {/* 🧾 Expense Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl shadow"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #DCDCDC",
          }}
        >
          <div className="mb-4">
            <label className="block mb-1 text-sm" style={{ color: "#667781" }}>
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#DCDCDC",
                color: "#3B4A54",
              }}
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

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              className="p-2 rounded-lg border"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#DCDCDC",
                color: "#3B4A54",
              }}
              required
            />
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="p-2 rounded-lg border"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#DCDCDC",
                color: "#3B4A54",
              }}
              required
            />
          </div>

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full mb-4 p-2 rounded-lg border"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#DCDCDC",
              color: "#3B4A54",
            }}
          ></textarea>

          {/* Recurring */}
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              name="isRecurring"
              checked={form.isRecurring}
              onChange={handleChange}
            />
            <label style={{ color: "#3B4A54" }}>Recurring Expense</label>
          </div>

          {form.isRecurring && (
            <div className="mb-4">
              <label
                className="block mb-1 text-sm"
                style={{ color: "#667781" }}
              >
                Recurrence Interval
              </label>
              <select
                name="recurrenceInterval"
                value={form.recurrenceInterval}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#DCDCDC",
                  color: "#3B4A54",
                }}
              >
                <option value="">Select interval</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}
          <div className="p-6 rounded-2xl shadow">
            <div className="flex gap-3">
              {/* Add / Save button */}
              <button
                type="submit"
                className="w-full py-2.5 font-semibold rounded-lg"
                style={{
                  backgroundColor: "#24D366",
                  color: "#FFFFFF",
                }}
              >
                {editingId ? "Save Changes" : "Add Expense"}
              </button>

              {/* Cancel button */}
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
                  className="w-full py-2.5 font-semibold rounded-lg"
                  style={{
                    backgroundColor: "#E6E6E6",
                    color: "#111B21",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Expense Table */}
        <div
          className="p-6 rounded-2xl shadow overflow-x-auto"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #DCDCDC",
          }}
        >
          <table className="w-full">
            <thead>
              <tr
                style={{ color: "#24D366", borderBottom: "1px solid #E6E6E6" }}
              >
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
                    style={{
                      borderBottom: "1px solid #E6E6E6",
                    }}
                    className="hover:bg-[#F5F5F5]"
                  >
                    <td className="py-2">{exp.date?.slice(0, 10)}</td>
                    <td className="py-2">{exp.category}</td>
                    <td className="py-2">{exp.description || "—"}</td>
                    <td
                      className="py-2 font-semibold"
                      style={{ color: "#24D366" }}
                    >
                      ₹{exp.amount}
                    </td>
                    <td className="py-2">
                      {exp.isRecurring ? exp.recurrenceInterval : "—"}
                    </td>
                    <td className="py-2 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(exp)}
                        className="px-3 py-1 text-sm rounded"
                        style={{ backgroundColor: "#cfe2ff", color: "#111B21" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="px-3 py-1 text-sm rounded"
                        style={{ backgroundColor: "#ffdddd", color: "#111B21" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-4"
                    style={{ color: "#667781" }}
                  >
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
