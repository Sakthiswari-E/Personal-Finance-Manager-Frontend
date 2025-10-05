import React, { useMemo } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

//  Colors
const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#8BC34A",
  "#E91E63",
  "#00BCD4",
  "#9C27B0",
  "#CDDC39",
  "#3F51B5",
  "#FF5722",
  "#795548",
  "#607D8B",
];

// Register components and plugins
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  annotationPlugin
);

export default function Charts({ categoryTotals, labels, budgets = {} }) {
  //  Pie chart data
  const pieData = useMemo(() => {
    const usedLabels = labels.filter((c) => (categoryTotals[c] || 0) > 0);
    const data = usedLabels.map((c) => +categoryTotals[c].toFixed(2));
    const backgroundColor = usedLabels.map((c, i) =>
      budgets[c] && categoryTotals[c] > budgets[c]
        ? "#FF4C4C"
        : COLORS[i % COLORS.length]
    );

    return {
      labels: usedLabels,
      datasets: [
        {
          label: "Spending",
          data,
          backgroundColor,
          borderWidth: 1,
        },
      ],
    };
  }, [categoryTotals, labels, budgets]);

  //  Bar chart data
  const barData = useMemo(() => {
    const data = labels.map((c) => +categoryTotals[c].toFixed(2));
    const backgroundColor = labels.map((c, i) =>
      budgets[c] && categoryTotals[c] > budgets[c]
        ? "#FF4C4C"
        : COLORS[i % COLORS.length]
    );

    return {
      labels,
      datasets: [
        {
          label: "Amount Spent",
          data,
          backgroundColor,
        },
      ],
    };
  }, [categoryTotals, labels, budgets]);

  //  Bar chart options (Chart.js v4 syntax — no borderCapStyle)
  const barOptions = useMemo(() => {
    const annotations = {};

    labels.forEach((c, i) => {
      if (budgets[c]) {
        annotations[`line-${i}`] = {
          type: "line",
          yMin: budgets[c],
          yMax: budgets[c],
          borderColor: "rgba(0, 0, 0, 0.8)",
          borderWidth: 1,
          label: {
            display: true,
            content: `Budget ₹${budgets[c]}`,
            position: "end",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "#fff",
            font: { size: 10 },
            padding: 4,
          },
        };
      }
    });

    return {
      responsive: true,
      plugins: {
        legend: { display: false },
        annotation: { annotations },
      },
      scales: {
        y: { beginAtZero: true },
      },
    };
  }, [labels, budgets]);

  return (
    <section className="bg-white p-4 rounded shadow">
      <h2 className="font-medium mb-3">Visualizations</h2>

      <div className="mb-2 text-sm">
        <span className="inline-block w-3 h-3 bg-red-500 mr-1 rounded-sm"></span>
        Over Budget
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pie chart */}
        <div className="p-2 border rounded">
          <h3 className="text-sm font-medium mb-2">
            Category Pie (Red = Over Budget)
          </h3>
          {pieData.labels.length === 0 ? (
            <div className="text-sm text-gray-500">No data to show.</div>
          ) : (
            <Pie data={pieData} />
          )}
        </div>

        {/* Bar chart */}
        <div className="p-2 border rounded">
          <h3 className="text-sm font-medium mb-2">
            Category Bar (Red = Over Budget)
          </h3>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </section>
  );
}
