import React, { useState } from "react";

export default function ExpensesList({ expenses = [], onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const startEditing = (exp) => {
    setEditingId(exp._id || exp.id);
    setFormData({
      amount: exp.amount,
      category: exp.category,
      date: exp.date ? exp.date.slice(0, 10) : "",
      description: exp.description || exp.note || "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({});
  };

  const saveEdit = async (exp) => {
    try {
      const updatedExpense = {
        ...exp,
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        description: formData.description,
      };

      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/api/expenses/${exp._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(updatedExpense),
      });

      if (!res.ok) throw new Error("Failed to update expense");

      const data = await res.json();
      onUpdate(data.data);
      setEditingId(null);
    } catch (err) {
      console.error(" Failed to save expense:", err);
      alert("Failed to save changes.");
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/api/expenses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) throw new Error("Failed to delete expense");

      onDelete(id);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete expense.");
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="text-sm text-gray-500 bg-white p-4 rounded shadow">
        No expenses found.
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h2 className="font-medium mb-3">Expenses</h2>
      <ul className="space-y-3">
        {expenses.map((exp) => {
          const isEditing = editingId === (exp._id || exp.id);

          return (
            <li
              key={exp._id || exp.id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <div className="flex-1">
                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="number"
                      className="border p-1 rounded text-sm"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      placeholder="Amount"
                    />
                    <input
                      type="text"
                      className="border p-1 rounded text-sm"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      placeholder="Category"
                    />
                    <input
                      type="date"
                      className="border p-1 rounded text-sm"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      className="border p-1 rounded text-sm"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Description"
                    />
                  </div>
                ) : (
                  <>
                    <div className="font-medium">
                      ₹{Number(exp.amount).toFixed(2)} • {exp.category}
                    </div>
                    <div className="text-xs text-gray-600">
                      {new Date(exp.date).toLocaleDateString()}{" "}
                      {exp.description || exp.note
                        ? `• ${exp.description || exp.note}`
                        : ""}
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded"
                      onClick={() => saveEdit(exp)}
                    >
                      Save
                    </button>
                    <button
                      className="text-xs px-2 py-1 bg-gray-200 rounded"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="text-xs px-2 py-1 border rounded"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          JSON.stringify(exp, null, 2)
                        );
                        alert("Copied entry JSON to clipboard");
                      }}
                    >
                      Copy
                    </button>
                    <button
                      className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded"
                      onClick={() => startEditing(exp)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded"
                      onClick={() => deleteExpense(exp._id || exp.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
