import { useEffect, useState } from "react";
import { getExpenseReport } from "../../api/reports";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "#06B6D4",
  "#9333EA",
  "#F59E0B",
  "#10B981",
  "#EF4444",
  "#8B5CF6",
  "#F97316",
  "#3B82F6",
];

export default function ExpenseReport() {
  const [data, setData] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("pie");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getExpenseReport({ startDate: start, endDate: end });
      setData(res.byCategory || []);
    } catch (err) {
      console.error("Error fetching expenses report:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //  Fix: use amount instead of total
  const totalSpent = data.reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div className="min-h-screen p-8 bg-[#0b0c10] text-gray-100 space-y-8">
      <h1 className="text-3xl font-semibold text-teal-400">Expense Categorization</h1>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 bg-[#111827] p-4 rounded-xl border border-gray-800">
        <div className="flex gap-2 items-center">
          <label className="text-gray-300">Start:</label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="bg-[#0F172A] text-gray-200 p-2 rounded-lg border border-[#334155] focus:border-teal-500 outline-none"
          />
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-gray-300">End:</label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="bg-[#0F172A] text-gray-200 p-2 rounded-lg border border-[#334155] focus:border-teal-500 outline-none"
          />
        </div>

        <button
          onClick={fetchData}
          className="bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg font-semibold text-white transition"
        >
          Apply Filter
        </button>

        <button
          onClick={() => setChartType(chartType === "pie" ? "bar" : "pie")}
          className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg font-semibold text-white transition"
        >
          Switch to {chartType === "pie" ? "Bar" : "Pie"} Chart
        </button>
      </div>

      {/* Chart Section */}
      <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800 shadow-lg">
        {loading ? (
          <p className="text-gray-400">Loading data...</p>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            {chartType === "pie" ? (
              <PieChart>
                <Pie
                  data={data}
                  dataKey="amount"  
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={(e) =>
                    `${e.category} (${((e.amount / totalSpent) * 100).toFixed(1)}%)`
                  }
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <BarChart data={data}>
                <XAxis dataKey="category" stroke="#ccc" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#14B8A6" name="Total Spent" /> {/*  changed */}
              </BarChart>
            )}
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-400">No expenses found in this range.</p>
        )}
      </div>

      {/* Summary List */}
      {data.length > 0 && (
        <div className="bg-[#111827] p-4 rounded-2xl border border-gray-800 shadow-lg">
          <h3 className="text-lg font-semibold text-teal-400 mb-4">
            Expense Summary ({data.length} categories)
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item) => (
              <div
                key={item.category}
                className="bg-[#0F172A] p-4 rounded-lg border border-gray-700 hover:border-teal-500 transition"
              >
                <h4 className="font-semibold text-gray-200">{item.category}</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Transactions: {item.transactions || 0}
                </p>
                <p className="text-teal-400 font-bold text-lg mt-1">
                  ₹{(item.amount || 0).toLocaleString()} {/* changed */}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
