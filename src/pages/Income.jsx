import React, { useEffect, useMemo, useState } from "react";
import api from "../api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Income() {
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch income (type = income)
  const fetchIncome = async () => {
    try {
      const res = await api.get("/expenses?type=income");
      setIncome(res.data || []);
    } catch (err) {
      console.error("❌ Income fetch error:", err);
      setIncome([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  // Total Income
  const totalIncome = useMemo(
    () => income.reduce((sum, i) => sum + Number(i.amount || 0), 0),
    [income]
  );

  // Monthly grouping
  const monthlyIncome = useMemo(() => {
    const map = {};
    income.forEach((i) => {
      const d = new Date(i.date);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      map[key] = (map[key] || 0) + Number(i.amount || 0);
    });

    return Object.entries(map)
      .sort()
      .map(([date, total]) => ({ date, total }));
  }, [income]);

  // Chart data
  const chartData = {
    labels: monthlyIncome.map((m) => m.date),
    datasets: [
      {
        label: "Monthly Income (₹)",
        data: monthlyIncome.map((m) => m.total),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="min-h-screen p-8 bg-[#F0F2F5]">
      <h1 className="text-3xl font-semibold mb-6 text-[#111B21]">
        Income Overview
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading income data...</p>
      ) : (
        <>
          {/* Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <h2 className="text-lg font-medium text-gray-600">
              Total Income
            </h2>
            <p className="text-3xl font-bold text-green-600 mt-2">
              ₹{totalIncome.toLocaleString()}
            </p>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <h2 className="text-lg font-medium mb-4 text-[#111B21]">
              Income Growth
            </h2>
            {monthlyIncome.length ? (
              <Line data={chartData} />
            ) : (
              <p className="text-gray-500">No income data available</p>
            )}
          </div>

          {/* Income Table */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-medium mb-4 text-[#111B21]">
              Income History
            </h2>

            {income.length === 0 ? (
              <p className="text-gray-500">No income records found</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Source</th>
                    <th className="p-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {income.map((i) => (
                    <tr
                      key={i._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-2">
                        {new Date(i.date).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        {i.category || "Income"}
                      </td>
                      <td className="p-2 text-right text-green-600">
                        ₹{Number(i.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
