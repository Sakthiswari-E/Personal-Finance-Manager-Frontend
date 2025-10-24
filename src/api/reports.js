//  frontend/src/api/reports.js
import { api } from "../api";

// Expense Report
export async function getExpenseReport(filters = {}) {
  try {
    const params = new URLSearchParams(filters);
    const res = await api.get(`/api/reports/expenses?${params}`);
    return {
      byCategory: res.data.byCategory || [],
      dailyTrend: res.data.dailyTrend || [],
      items: res.data.items || [],
    };
  } catch (err) {
    console.error("getExpenseReport error:", err);
    return { byCategory: [], dailyTrend: [], items: [] };
  }
}

// Monthly Summary
export const getMonthlySummary = async () => {
  try {
    const res = await api.get("/reports/summary");
    return res.data;
  } catch (err) {
    console.error("Error fetching monthly summary:", err);
    return { totalSpent: 0, remainingBudget: 0, topCategory: "N/A" };
  }
};

//  Budget Report
export async function getBudgetReport() {
  try {
    const res = await api.get("/api/reports/budgets");
    const data = res.data.summary || res.data;
    return data.map((b) => ({
      category: b.category,
      budget: b.budget || b.amount || 0,
      spent: b.spent || 0,
      remaining: b.remaining || 0,
      status: b.status || "On Track",
      percentUsed: b.percentUsed || Math.round(((b.spent || 0) / (b.budget || 1)) * 100),
      recommendation:
        ((b.spent || 0) / (b.budget || 1)) * 100 > 100
          ? "Reduce spending (over budget)"
          : ((b.spent || 0) / (b.budget || 1)) * 100 > 80
          ? "Close to limit — monitor"
          : "On track",
    }));
  } catch (err) {
    console.error("getBudgetReport error:", err);
    return [];
  }
}

//  Income Report
export async function getIncomeReport() {
  try {
    const res = await api.get("/api/reports/income");
    return {
      totalIncome: res.data.totalIncome || 0,
      sources: res.data.sources || [],
      monthlyTrend: res.data.monthlyTrend || [],
    };
  } catch (err) {
    console.error("getIncomeReport error:", err);
    return { totalIncome: 0, sources: [], monthlyTrend: [] };
  }
}
