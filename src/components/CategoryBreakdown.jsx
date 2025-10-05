import React from "react";

export default function CategoryBreakdown({ totals, budgets }) {
  return (
    <section className="bg-white p-4 rounded shadow">
      <h2 className="font-medium mb-3">Category Breakdown</h2>
      <ul>
        {Object.keys(totals).map((cat) => {
          const amount = totals[cat];
          const limit = budgets?.[cat] || 0;
          const overBudget = limit && amount > limit;
          return (
            <li key={cat} className="flex justify-between py-1">
              <span>{cat}</span>
              <span className={overBudget ? "text-red-600 font-semibold" : ""}>
                ₹{amount.toFixed(2)}
                {limit ? ` / ₹${limit.toFixed(2)}` : ""}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
