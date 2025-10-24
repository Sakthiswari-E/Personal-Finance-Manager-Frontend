import { useEffect, useState } from "react";
import { api } from "../../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Chart, LineController, LineElement, PointElement, Filler } from "chart.js";

Chart.register(LineController, LineElement, PointElement, Filler);

export default function BudgetReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/reports/budgets");
        const result = (res.data.summary || res.data || []).map((b) => ({
          category: b.category,
          budget: b.budget || b.amount || 0,
          spent: b.spent || 0,
          remaining: b.remaining || 0,
          percentUsed: Math.round(((b.spent || 0) / (b.budget || 1)) * 100),
          recommendation:
            ((b.spent || 0) / (b.budget || 1)) * 100 > 100
              ? "Over budget! Reduce spending."
              : ((b.spent || 0) / (b.budget || 1)) * 100 > 80
              ? "Close to limit — monitor."
              : "On track.",
        }));

        if (!result.length) {
          console.warn("⚠️ No backend data, using mock data for preview.");
          setData(mockData);
        } else {
          setData(result);
        }
      } catch (err) {
        console.error("❌ Error fetching budget report:", err);
        setData(mockData);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-center text-gray-400">Loading budget report...</p>;
  if (!data.length) return <p className="text-center text-gray-400">No budget data found.</p>;

  return (
    <div className="space-y-6 p-6 min-h-screen bg-[#0b0c10] text-gray-100">
      <h2 className="text-2xl font-semibold text-teal-400">Budget vs Spending</h2>

      {/* Chart Section */}
      <div className="bg-[#111827] p-4 rounded-2xl shadow-lg border border-gray-800">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="category" stroke="#ccc" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="budget" fill="#9333EA" name="Budget" />
            <Bar dataKey="spent" fill="#14B8A6" name="Spent" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recommendation Cards */}
      <div className="grid gap-4">
        {data.map((b) => (
          <div
            key={b.category}
            className="p-4 bg-[#111827] rounded-2xl border border-gray-800 shadow"
          >
            <div className="flex justify-between">
              <strong>{b.category}</strong>
              <span className="text-sm text-gray-400">Used: {b.percentUsed}%</span>
            </div>
            <div className="text-sm mt-1 text-gray-300">{b.recommendation}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mock Data (offline preview)
const mockData = [
  { category: "Food", budget: 100, spent: 750, percentUsed: 75, recommendation: "You're doing well. Keep tracking daily meals!" },
  { category: "Transport", budget: 500, spent: 300, percentUsed: 60, recommendation: "Consider using public transport more often." },
  { category: "Entertainment", budget: 400, spent: 380, percentUsed: 95, recommendation: "Almost over budget! Pause subscriptions or outings." },
  { category: "Shopping", budget: 800, spent: 600, percentUsed: 75, recommendation: "Maintain this pace to stay within budget." },
];
