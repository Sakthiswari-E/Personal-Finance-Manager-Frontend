import { useEffect, useState } from "react";
import { getIncomeReport } from "../../api/reports";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

const COLORS = ["#82ca9d", "#8884d8", "#ffb74d", "#ef5350"];

export default function IncomeReport() {
  const [data, setData] = useState({ sources: [], totalIncome: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getIncomeReport();
      setData(res);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="text-center text-gray-400">Loading income report...</p>;

  const incomeData = data.sources || [];
  const comparisonData = [{ name: "Total Income", amount: data.totalIncome || 0 }];

  return (
    <div className="min-h-screen space-y-6 p-6 bg-[#0b0c10] text-gray-100">
      <h2 className="text-2xl font-semibold text-teal-400">Income Report</h2>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[#111827] p-4 rounded-2xl border border-gray-800 shadow">
          <h3 className="mb-3 text-lg font-semibold text-teal-300">Income Breakdown</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={incomeData} dataKey="amount" nameKey="source" outerRadius={90} label>
                {incomeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#111827] p-4 rounded-2xl border border-gray-800 shadow">
          <h3 className="mb-3 text-lg font-semibold text-teal-300">Income Summary</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={comparisonData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#14B8A6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
