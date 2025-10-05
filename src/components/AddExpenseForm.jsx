//  frontend/src/components/AddExpenseForm.jsx
import React, { useState } from "react";
import { CATEGORIES } from "../constants";
import toast from "react-hot-toast";
import { addExpense } from "../lib/api";

export default function AddExpenseForm({ onAdd }) {
  const [form, setForm] = useState({
    amount: "",
    category: CATEGORIES[0],
    date: new Date().toISOString().slice(0, 10),
    note: "",
    recurring: "none",
  });

  const [submitting, setSubmitting] = useState(false);

  function resetForm() {
    setForm({
      amount: "",
      category: CATEGORIES[0],
      date: new Date().toISOString().slice(0, 10),
      note: "",
      recurring: "none",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const num = parseFloat(form.amount);

    if (Number.isNaN(num) || num <= 0) {
      toast.error("Please enter a valid amount > 0");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        amount: +num.toFixed(2),
        category: form.category,
        date: form.date,
        description: form.note.trim(),
        type: "expense",
        recurrence:
          form.recurring !== "none"
            ? {
                enabled: true,
                frequency: form.recurring,
                startDate: form.date,
              }
            : { enabled: false },
      };

      // Use centralized API call (auto includes token & baseURL)
      const { data } = await addExpense(payload);

      toast.success("Expense added successfully!");
      if (onAdd) onAdd(data);
      resetForm();
    } catch (err) {
      console.error("Add expense error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to add expense");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="bg-white p-4 rounded shadow" onSubmit={handleSubmit}>
      <h2 className="font-medium mb-3">Add Expense</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="number"
          step="0.01"
          placeholder="Amount (₹)"
          className="p-2 border rounded"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />

        <select
          className="p-2 border rounded"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="p-2 border rounded"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Note (optional)"
          className="p-2 border rounded"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />

        <div>
          <label className="text-sm text-gray-600 font-medium block mb-1">
            Recurrence
          </label>
          <select
            className="p-2 border rounded w-full"
            value={form.recurring}
            onChange={(e) => setForm({ ...form, recurring: e.target.value })}
          >
            <option value="none">One-time</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className={`px-4 py-2 rounded text-white ${
            submitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {submitting ? "Adding..." : "Add"}
        </button>

        <button
          type="button"
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={resetForm}
        >
          Reset
        </button>
      </div>
    </form>
  );
}
