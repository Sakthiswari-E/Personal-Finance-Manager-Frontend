// frontend/src/components/ForecastChart.jsx
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getForecast } from "../lib/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ForecastChart({
  historyMonths = 6,
  forecastMonths = 6,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const resp = await getForecast(historyMonths, forecastMonths);
        const payload = resp.data;

        // labels: combine history months and forecast months
        const historyLabels = payload.history.map((h) => h.month);
        const historyNet = payload.history.map((h) => h.net);

        const forecastLabels = payload.forecast.map((f) => f.month);
        const forecastNet = payload.forecast.map((f) => f.predictedNet);

        const labels = [...historyLabels, ...forecastLabels];

        const chartData = {
          labels,
          datasets: [
            {
              label: "Historical net (income - expenses)",
              data: [...historyNet, ...Array(forecastNet.length).fill(null)],
              borderDash: [],
              tension: 0.2,
              fill: false,
            },
            {
              label: "Forecasted net",
              data: [...Array(historyNet.length).fill(null), ...forecastNet],
              borderDash: [6, 6],
              tension: 0.2,
              fill: false,
            },
          ],
        };

        setData({ chartData, summary: payload.projectionSummary });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [historyMonths, forecastMonths]);

  if (loading) return <div className="p-4">Loading forecast...</div>;
  if (!data) return <div className="p-4">No forecast available</div>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Financial Forecast</h3>
        <div className="text-sm text-gray-600">
          Avg/month: {data.summary.monthlyAvgNet} • Projection ({forecastMonths}{" "}
          mo): {data.summary.totalProjectedNet}
        </div>
      </div>

      <Line
        data={data.chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: false },
          },
          scales: {
            y: { beginAtZero: false },
          },
        }}
      />
    </div>
  );
}
