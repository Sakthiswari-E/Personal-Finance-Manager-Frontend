import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import api from "../api";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit, RefreshCw } from "lucide-react";

export default function GoalsPage() {
  const { goals, refreshData } = useContext(AppContext);
  const [form, setForm] = useState({
    name: "",
    target: "",
    saved: "",
    category: "",
    startDate: "",
    endDate: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.target) return alert("Enter goal name and target");

    try {
      setLoading(true);
      if (editingId) {
        //  FIXED: remove duplicate `/api`
        await api.put(`/goals/${editingId}`, form);
      } else {
        // FIXED: remove duplicate `/api`
        await api.post("/goals", form);
      }

      setForm({
        name: "",
        target: "",
        saved: "",
        category: "",
        startDate: "",
        endDate: "",
      });
      setEditingId(null);

      refreshData();
      localStorage.setItem("goals_updated", Date.now().toString());
    } catch (err) {
      console.error("Goal save error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (goal) => {
    setEditingId(goal._id);
    setForm({
      name: goal.name,
      target: goal.target,
      saved: goal.saved,
      category: goal.category || "",
      startDate: goal.startDate ? goal.startDate.split("T")[0] : "",
      endDate: goal.endDate ? goal.endDate.split("T")[0] : "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this goal?")) return;
    try {
      //  FIXED: remove duplicate `/api`
      await api.delete(`/goals/${id}`);
      refreshData();
      localStorage.setItem("goals_updated", Date.now().toString());
    } catch (err) {
      console.error("Goal delete error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="min-h-screen p-8 text-gray-100 bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-teal-400">Goals</h1>
        <button
          onClick={refreshData}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-2 text-sm"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Add Goal Form */}
      <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800 shadow-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            name="name"
            placeholder="Goal Name"
            value={form.name}
            onChange={handleChange}
            className="bg-gray-800 text-gray-100 p-3 rounded-lg outline-none border border-gray-700"
          />
          <input
            name="target"
            type="number"
            placeholder="Target Amount (₹)"
            value={form.target}
            onChange={handleChange}
            className="bg-gray-800 text-gray-100 p-3 rounded-lg outline-none border border-gray-700"
          />
          <input
            name="saved"
            type="number"
            placeholder="Saved Amount (₹)"
            value={form.saved}
            onChange={handleChange}
            className="bg-gray-800 text-gray-100 p-3 rounded-lg outline-none border border-gray-700"
          />
          <input
            name="category"
            placeholder="Category (optional)"
            value={form.category}
            onChange={handleChange}
            className="bg-gray-800 text-gray-100 p-3 rounded-lg outline-none border border-gray-700"
          />
          <input
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            className="bg-gray-800 text-gray-100 p-3 rounded-lg outline-none border border-gray-700"
          />
          <input
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            className="bg-gray-800 text-gray-100 p-3 rounded-lg outline-none border border-gray-700"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          {editingId ? "Update Goal" : "Add Goal"}
        </button>
      </div>

      {/* Goal Cards */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <p className="text-gray-400">No goals yet.</p>
        ) : (
          goals.map((g) => {
            const progress = g.target
              ? Math.min(((g.saved || 0) / g.target) * 100, 100).toFixed(1)
              : 0;

            return (
              <motion.div
                key={g._id}
                whileHover={{ scale: 1.02 }}
                className="bg-[#111827] p-5 rounded-2xl border border-gray-800 shadow-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-teal-400">{g.name}</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(g)}
                      className="text-blue-400 hover:text-blue-500"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(g._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <div className="text-sm text-gray-400 flex justify-between">
                  <span>Saved: ₹{g.saved?.toLocaleString() || 0}</span>
                  <span>Target: ₹{g.target?.toLocaleString() || 0}</span>
                  <span>{progress}%</span>
                </div>

                <div className="text-xs text-gray-500 mt-1">
                  {g.startDate
                    ? `Start: ${new Date(g.startDate).toLocaleDateString()}`
                    : "Start: —"}{" "}
                  —{" "}
                  {g.endDate
                    ? `Deadline: ${new Date(g.endDate).toLocaleDateString()}`
                    : "No deadline"}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
