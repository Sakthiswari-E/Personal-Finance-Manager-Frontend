// frontend/src/pages/Transactions.jsx
import React, { useEffect, useState } from "react";
import { getTransactions, addTransaction, getBudgets } from "../lib/api.js";
import { CATEGORIES } from "../constants.js";
import toast from "react-hot-toast";

export default function Transactions() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: CATEGORIES[0],
    date: new Date().toISOString().slice(0, 10),
    description: "",
  });
  const [loading, setLoading] = useState(false);

  // Load all transactions
  const load = async () => {
    try {
      const res = await getTransactions();
      setItems(res.data || []);
    } catch (err) {
      console.error("Failed to load transactions", err);
      toast.error("Failed to load transactions");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Submit new transaction
  const submit = async (e) => {
    e.preventDefault();
    const num = parseFloat(form.amount);
    if (Number.isNaN(num) || num <= 0) {
      toast.error("Please enter a valid amount > 0");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        amount: +num.toFixed(2),
        date: form.date || new Date(),
      };
      console.log("Submitting payload:", payload);

      await addTransaction(payload);

      // reload transactions
      await load();

      // Check budgets and show alert if > 80%
      try {
        const bRes = await getBudgets();
        const budgets = bRes.data || [];
        const budget = budgets.find((b) => b.category === payload.category);
        if (budget) {
          // compute spent in that category using latest items (after reload)
          const currentSpent =
            items
              .concat()
              .filter(
                (t) => t.category === payload.category && t.type === "expense"
              )
              .reduce((s, t) => s + Number(t.amount || 0), 0) +
            (payload.type === "expense" ? payload.amount : 0);
          if (currentSpent > budget.limit * 0.8) {
            toast.warning(`⚠ You're > 80% of budget for ${budget.category}`);
          }
        }
      } catch (err) {
        console.warn("Budget check failed:", err);
      }

      // reset form
      setForm({
        type: "expense",
        amount: "",
        category: CATEGORIES[0],
        date: new Date().toISOString().slice(0, 10),
        description: "",
      });

      toast.success("Transaction added");
    } catch (err) {
      console.error(
        "Failed to add transaction:",
        err.response?.data || err.message
      );
      toast.error(err.response?.data?.message || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Add Transaction Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-2">Add Transaction</h3>
        <form
          onSubmit={submit}
          className="grid grid-cols-1 md:grid-cols-4 gap-3"
        >
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="Amount"
            className="border p-2 rounded"
            required
          />

          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border p-2 rounded"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="border p-2 rounded"
            required
          />

          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            className="border p-2 rounded md:col-span-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded md:col-span-1"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>
      </div>

      {/* Transactions Table */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-4">Transactions</h3>
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id} className="border-t">
                <td className="py-3">
                  {new Date(it.date).toLocaleDateString()}
                </td>
                <td>{it.category}</td>
                <td>{it.description}</td>
                <td
                  className={
                    it.type === "income" ? "text-green-600" : "text-red-600"
                  }
                >
                  {it.type === "income" ? "+" : "-"}₹
                  {Number(it.amount).toFixed(2)}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-4">
                  No transactions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
