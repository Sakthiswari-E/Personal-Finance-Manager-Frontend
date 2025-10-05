import React, { useEffect, useState, useMemo } from "react";
import {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
  getTransactions,
} from "../lib/api.js";
import { CATEGORIES } from "../constants.js";
import toast from "react-hot-toast";

export default function Budgets() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({ category: "", limit: "" });
  const [editingId, setEditingId] = useState(null);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("category");

  // Load budgets + expenses
  const load = async () => {
    try {
      const resBudgets = await getBudgets();
      const resTxns = await getTransactions();
      setBudgets(resBudgets.data);
      setTransactions(resTxns.data);
    } catch (err) {
      console.error("Failed to load data", err);
      toast.error("Failed to load budgets/transactions");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Add/Edit budget
  const submit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.limit) {
      return toast.error("Please enter both category and limit");
    }

    try {
      if (editingId) {
        await updateBudget(editingId, {
          ...form,
          limit: parseFloat(form.limit),
        });
        toast.success("Budget updated successfully!");
        setEditingId(null);
      } else {
        await addBudget({ ...form, limit: parseFloat(form.limit) });
        toast.success("Budget added successfully!");
      }

      // reset form
      setForm({ category: "", limit: "" });
      await load();

      const updatedBudget = budgets.find((b) => b.category === form.category);
      if (updatedBudget) {
        const spent = transactions
          .filter(
            (t) => t.category === updatedBudget.category && t.type === "expense"
          )
          .reduce((sum, t) => sum + t.amount, 0);

        if (spent > parseFloat(form.limit)) {
          toast.error(
            `Budget exceeded! Already spent ₹${spent} on ${form.category}`
          );
        }
      }
    } catch (err) {
      console.error("Failed to save budget", err);
      toast.error("Failed to save budget");
    }
  };

  // Delete budget
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this budget?")) return;
    try {
      await deleteBudget(id);
      toast.success("Budget deleted successfully");
      load();
    } catch (err) {
      console.error("Failed to delete budget", err);
      toast.error("Failed to delete budget");
    }
  };

  // Edit budget
  const handleEdit = (budget) => {
    setForm({ category: budget.category, limit: budget.limit });
    setEditingId(budget._id);
  };

  // Filtered & sorted budgets with monitoring
  const displayedBudgets = useMemo(() => {
    let list = budgets.map((b) => {
      const spent = transactions
        .filter((t) => t.category === b.category && t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        ...b,
        spent,
        remaining: b.limit - spent,
        exceeded: spent > b.limit,
      };
    });

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((b) => b.category.toLowerCase().includes(q));
    }
    if (sortBy === "category") {
      list.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === "limit") {
      list.sort((a, b) => b.limit - a.limit);
    }
    return list;
  }, [budgets, transactions, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      {/* Add/Edit Budget Form */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">
          {editingId ? "Edit Budget" : "Add Budget"}
        </h3>
        <form
          onSubmit={submit}
          className="flex flex-col sm:flex-row gap-2 mb-3"
        >
          {/* Category dropdown */}
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="p-2 border rounded flex-1"
            required
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            value={form.limit}
            onChange={(e) => setForm({ ...form, limit: e.target.value })}
            placeholder="Limit"
            type="number"
            className="p-2 border rounded flex-1"
            required
          />

          <button className="bg-green-600 text-white px-4 py-2 rounded">
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={() => {
                setForm({ category: "", limit: "" });
                setEditingId(null);
              }}
            >
              Cancel
            </button>
          )}
        </form>

        {/* Filters */}
        <div className="flex gap-2 items-center">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search category..."
            className="p-2 border rounded flex-1"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="category">Sort by Category</option>
            <option value="limit">Sort by Limit</option>
          </select>
        </div>
      </div>

      {/* Budgets List */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Budgets</h3>
        {displayedBudgets.length === 0 ? (
          <div className="text-gray-500">No budgets found.</div>
        ) : (
          <div className="space-y-2">
            {displayedBudgets.map((b) => {
              const percent = Math.min((b.spent / b.limit) * 100, 100);
              return (
                <div key={b._id} className="py-3 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{b.category}</span> -{" "}
                      <span>₹{b.limit.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(b)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded h-2 mt-2">
                    <div
                      className={`h-2 rounded ${
                        b.exceeded ? "bg-red-600" : "bg-green-600"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Spent: ₹{b.spent.toFixed(2)} / Remaining: ₹
                    {b.remaining.toFixed(2)}
                    {b.exceeded && (
                      <span className="text-red-600 ml-2 font-semibold">
                        ⚠ Exceeded
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
