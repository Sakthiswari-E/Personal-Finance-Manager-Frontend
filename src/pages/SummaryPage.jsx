// frontend/src/pages/SummaryPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#00C49F", "#FF8042", "#0088FE", "#FFBB28"];

export default function SummaryPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await api.get("/reports/summary"); 
        setSummary(res.data);
      } catch (err) {
        console.error("Error loading summary:", err);
        setError("Unable to load dashboard summary. Please try again.");
      }
    }
    fetchSummary();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!summary) return <p className="text-gray-300">Loading summary...</p>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Overview</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-xl text-center">
          <h2 className="text-lg">Total Budget</h2>
          <p className="text-2xl font-semibold">₹{summary.totalBudget || 0}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl text-center">
          <h2 className="text-lg">Total Spent</h2>
          <p className="text-2xl font-semibold text-red-400">₹{summary.totalSpent || 0}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl text-center">
          <h2 className="text-lg">Remaining</h2>
          <p className="text-2xl font-semibold text-green-400">₹{summary.remaining || 0}</p>
        </div>
      </div>

      <h3 className="text-xl mb-2">Spending by Category</h3>
      <div className="bg-gray-800 p-4 rounded-xl">
        {summary.categories?.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={summary.categories}
                  dataKey="spent"
                  nameKey="category"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {summary.categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <ul className="mt-4">
              {summary.categories.map((c, i) => (
                <li key={i}>
                  <strong>{c.category}</strong> — Spent ₹{c.spent} / ₹{c.budget}
                  <span className={c.spent > c.budget ? "text-red-400" : "text-green-400"}>
                    {" "}
                    ({c.percentUsed}%)
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No category data available</p>
        )}
      </div>
    </div>
  );
}
