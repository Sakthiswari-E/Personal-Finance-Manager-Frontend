import React, { useEffect, useState } from "react";
import { getGoals, addGoal, deleteGoal, updateGoal } from "../lib/api";
import toast from "react-hot-toast";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
    currentAmount: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Load goals on mount
  useEffect(() => {
    loadGoals();
  }, []);

  async function loadGoals() {
    try {
      setLoading(true);
      const res = await getGoals();
      const data = Array.isArray(res.data) ? res.data : res.data.goals || [];
      setGoals(data);
    } catch (err) {
      console.error(
        "❌ [loadGoals] error:",
        err?.response?.data || err.message
      );
      toast.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  }

  // Form change handler
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Add or update goal
  async function handleSubmit(e) {
    e.preventDefault();
    const { title, targetAmount, deadline, currentAmount } = form;

    if (!title || !targetAmount || !deadline) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      title: title.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount) || 0,
      deadline,
    };

    setSaving(true);
    try {
      if (editingId) {
        // 🔁 Update goal
        const res = await updateGoal(editingId, payload);
        const updatedGoal = res.data?.goal || res.data;
        setGoals((prev) =>
          prev.map((g) => (g._id === editingId ? updatedGoal : g))
        );
        toast.success("Goal updated successfully");
        setEditingId(null);
      } else {
        // ➕ Add new goal
        const res = await addGoal(payload);
        const newGoal = res.data?.goal || res.data;
        setGoals((prev) => [newGoal, ...prev]);
        toast.success("Goal added successfully");
      }

      // Reset form
      setForm({ title: "", targetAmount: "", currentAmount: "", deadline: "" });
    } catch (err) {
      console.error("[handleSubmit] error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Error saving goal");
    } finally {
      setSaving(false);
    }
  }

  //  Delete goal
  async function handleDelete(id) {
    if (!window.confirm("Delete this goal?")) return;
    try {
      await deleteGoal(id);
      setGoals((prev) => prev.filter((g) => g._id !== id));
      toast.success("Goal deleted");
    } catch (err) {
      console.error(" [handleDelete] error:", err);
      toast.error("Failed to delete goal");
    }
  }

  // Edit goal
  function handleEdit(goal) {
    setForm({
      title: goal.title,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount || 0,
      deadline: goal.deadline?.split("T")[0],
    });
    setEditingId(goal._id);
  }

  // Calculate progress %
  function calcProgress(goal) {
    const { currentAmount = 0, targetAmount = 1 } = goal;
    return Math.min(100, Math.round((currentAmount / targetAmount) * 100));
  }

  //  Reset form
  function resetForm() {
    setForm({ title: "", targetAmount: "", deadline: "", currentAmount: "" });
    setEditingId(null);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Financial Goals</h1>

      {/* ➕ Add / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded p-4 flex flex-wrap gap-3 mb-6"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Goal Title"
          className="border p-2 rounded flex-1 min-w-[200px]"
          required
        />
        <input
          name="targetAmount"
          value={form.targetAmount}
          onChange={handleChange}
          placeholder="Target Amount"
          type="number"
          className="border p-2 rounded w-40"
          required
        />
        <input
          name="currentAmount"
          value={form.currentAmount}
          onChange={handleChange}
          placeholder="Saved Amount"
          type="number"
          className="border p-2 rounded w-40"
        />
        <input
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          type="date"
          className="border p-2 rounded w-48"
          required
        />

        <button
          type="submit"
          disabled={saving}
          className={`px-4 py-2 rounded text-white transition ${
            saving
              ? "bg-gray-400"
              : editingId
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {saving ? "Saving..." : editingId ? "Update" : "Add"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </form>

      {/*  Goals List */}
      {loading ? (
        <p>Loading goals...</p>
      ) : goals.length === 0 ? (
        <p className="text-gray-500">No goals yet. Add one above.</p>
      ) : (
        <div className="space-y-4">
          {goals.map((g) => {
            const progress = calcProgress(g);
            return (
              <div key={g._id} className="bg-gray-50 p-4 rounded shadow">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h2 className="font-semibold">{g.title}</h2>
                    <p className="text-sm text-gray-500">
                      Target: ₹{g.targetAmount.toLocaleString()} • Saved: ₹
                      {g.currentAmount?.toLocaleString() || 0} • Deadline:{" "}
                      {new Date(g.deadline).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(g)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(g._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-green-500 h-3"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {progress}% complete
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
