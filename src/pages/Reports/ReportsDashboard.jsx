//frontend\src\pages\Reports\ReportsDashboard.jsx
import { useState } from "react";
import ExpenseReport from "./ExpenseReport";
import BudgetReport from "./BudgetReport";
import IncomeReport from "./IncomeReport";

export default function ReportsDashboard() {
  const [tab, setTab] = useState("expenses");

  const tabs = [
    { id: "expenses", label: "Expense Reports" },
    { id: "budgets", label: "Budget Reports" },
    { id: "income", label: "Income Reports" },
  ];

  return (
    <div className="p-6 min-h-screen bg-[#0b0c10] text-gray-100">
      <h1 className="text-3xl font-semibold mb-6 text-teal-400">Financial Reports</h1>

      <div className="flex gap-3 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              tab === t.id ? "bg-teal-600 text-white" : "bg-[#111827] text-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>
        {tab === "expenses" && <ExpenseReport />}
        {tab === "budgets" && <BudgetReport />}
        {tab === "income" && <IncomeReport />}
      </div>
    </div>
  );
}
