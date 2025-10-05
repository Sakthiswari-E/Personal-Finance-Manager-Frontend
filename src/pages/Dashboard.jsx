import React, { useEffect, useMemo, useState } from "react";
import AddExpenseForm from "../components/AddExpenseForm.jsx";
import Filters from "../components/Filters.jsx";
import ExpensesList from "../components/ExpenseList.jsx";
import CategoryBreakdown from "../components/CategoryBreakdown.jsx";
import Charts from "../components/Charts.jsx";
import ForecastChart from "../components/ForecastChart.jsx";
import NotificationsPanel from "../components/NotificationsPanel.jsx";
import { CATEGORIES, STORAGE_KEY } from "../constants.js";
import { loadExpenses, saveExpenses } from "../lib/utils/storage.js";
import { getBudgets as apiGetBudgets } from "../lib/api.js";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5001"; 


export default function Dashboard() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [expenses, setExpenses] = useState(() => loadExpenses() || []);
  const [budgets, setBudgets] = useState({});
  const [isLoggedIn] = useState(Boolean(token));
  const [notifications, setNotifications] = useState([]);

  // Filters
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [downloading, setDownloading] = useState(false);

  //  Unified Helper: add notification (saves to both state + localStorage)
  const addNotification = (title, message, type = "info") => {
    const newNotification = {
      title,
      message,
      type,
      timestamp: new Date(),
    };

    setNotifications((prev) => {
      const updated = [...prev, newNotification];
      localStorage.setItem("notifications", JSON.stringify(updated)); // persist
      return updated;
    });

    // Optional toast popup
    toast(`${title}: ${message}`, {
      icon: type === "warning" ? "⚠️" : type === "success" ? "✅" : "🔔",
    });
  };

  //  Load budgets from server
  useEffect(() => {
    async function loadBudgets() {
      try {
        if (isLoggedIn) {
          const res = await apiGetBudgets();
          const map = {};
          (res.data || []).forEach((b) => (map[b.category] = b.limit));
          setBudgets(map);
        } else setBudgets({});
      } catch (err) {
        console.error("Failed to load budgets", err);
        toast.error("Failed to load budgets");
      }
    }
    loadBudgets();
  }, [isLoggedIn]);

  // Fetch expenses from server
  useEffect(() => {
    async function fetchServerExpenses() {
      if (!isLoggedIn) return;
      try {
        const res = await axios.get(`${API_BASE}/api/expenses`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        console.log("Server returned:", res.data);
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        if (!Array.isArray(data)) {
          console.error("Server returned invalid data:", res.data);
          toast.error("Server data invalid");
          return;
        }

        setExpenses(data);
      } catch (err) {
        console.error("Failed to fetch expenses", err);
        toast.error("Failed to fetch expenses");
        setExpenses(loadExpenses() || []);
      } finally {
        setDownloading(false);
      }
    }
    fetchServerExpenses();
  }, [isLoggedIn]);

  // Persist to localStorage
  useEffect(() => {
    try {
      saveExpenses(expenses);
    } catch (err) {
      console.error("Failed to save expenses locally", err);
    }
  }, [expenses]);

  //  Add / Delete / Update Expense
  const addExpense = (newExp) => setExpenses((s) => [newExp, ...(s || [])]);

  const deleteExpense = async (id) => {
    if (!confirm("Delete this expense?")) return;
    try {
      const matchIdx = expenses.findIndex((x) => x._id === id || x.id === id);
      const item = matchIdx !== -1 ? expenses[matchIdx] : null;

      if (isLoggedIn && item && item._id) {
        await axios.delete(`${API_BASE}/api/expenses/${item._id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      }

      setExpenses((s) => s.filter((x) => !(x._id === id || x.id === id)));
      toast.success("Expense deleted");
    } catch (err) {
      console.error("Failed to delete expense:", err);
      toast.error("Failed to delete expense");
    }
  };

  const updateExpense = (updatedExpense) => {
    setExpenses((prev) =>
      (prev || []).map((e) =>
        e._id === updatedExpense._id || e.id === updatedExpense.id
          ? updatedExpense
          : e
      )
    );
  };

  // Filter + Sort Logic
  const filtered = useMemo(() => {
    let list = Array.isArray(expenses) ? [...expenses] : [];
    if (filterCategory !== "All")
      list = list.filter((x) => x.category === filterCategory);
    if (filterFrom)
      list = list.filter((x) => new Date(x.date) >= new Date(filterFrom));
    if (filterTo)
      list = list.filter((x) => new Date(x.date) <= new Date(filterTo));
    if (minAmount)
      list = list.filter((x) => Number(x.amount) >= parseFloat(minAmount));
    if (maxAmount)
      list = list.filter((x) => Number(x.amount) <= parseFloat(maxAmount));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((x) =>
        (x.description || x.note || "").toLowerCase().includes(q)
      );
    }
    if (sortBy === "recent")
      list.sort(
        (a, b) =>
          new Date(b.date) - new Date(a.date) ||
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    else if (sortBy === "highest")
      list.sort(
        (a, b) =>
          Number(b.amount) - Number(a.amount) ||
          new Date(b.date) - new Date(a.date)
      );
    return list;
  }, [
    expenses,
    filterCategory,
    filterFrom,
    filterTo,
    minAmount,
    maxAmount,
    query,
    sortBy,
  ]);

  //  Totals
  const total = useMemo(
    () =>
      (
        (Array.isArray(expenses)
          ? expenses.reduce((s, e) => s + Number(e.amount || 0), 0)
          : 0) || 0
      ).toFixed(2),
    [expenses]
  );

  const categoryTotals = useMemo(() => {
    const map = {};
    for (const c of CATEGORIES) map[c] = 0;
    for (const e of expenses || []) {
      if (!map[e.category]) map[e.category] = 0;
      map[e.category] += Number(e.amount || 0);
    }
    return map;
  }, [expenses]);

  //  Export Functions
  const downloadFile = async (url, filename) => {
    try {
      setDownloading(true);
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      toast.success(`Exported: ${filename}`);
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to export");
    } finally {
      setDownloading(false);
    }
  };

  const exportExpensesCSV = () =>
    downloadFile(`${API_BASE}/api/export/expenses/csv`, "expenses.csv");

  const exportPDF = () =>
    downloadFile(`${API_BASE}/api/export/report/pdf`, "Full_Report.pdf");

  const exportZIP = () =>
    downloadFile(`${API_BASE}/api/export/all/zip`, "Full_Data_Export.zip");

  // Check budgets & reminders (notifications + toast)
  useEffect(() => {
    if (!expenses.length || !Object.keys(budgets).length) return;

    const today = new Date();

    Object.entries(budgets).forEach(([category, limit]) => {
      const spent = expenses
        .filter((e) => e.category === category)
        .reduce((sum, e) => sum + Number(e.amount || 0), 0);

      if (limit > 0 && spent >= 0.9 * limit) {
        addNotification(
          "Budget Limit Approaching",
          `${category} budget is almost reached (${spent}/${limit})`,
          "warning"
        );
      }
    });

    expenses.forEach((e) => {
      if (e.recurring && e.nextDueDate) {
        const due = new Date(e.nextDueDate);
        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        if (diffDays > 0 && diffDays <= 5) {
          addNotification(
            "Upcoming Bill",
            `${e.description} is due in ${diffDays} days`,
            "info"
          );
        }
      }
    });
  }, [expenses, budgets]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        {/*  Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-semibold text-center sm:text-left">
            Dashboard
          </h1>

          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-3">
            <div className="text-sm text-gray-600 w-full sm:w-auto text-center sm:text-right">
              Total Spent: ₹{total}
            </div>

            <button
              onClick={exportExpensesCSV}
              disabled={downloading}
              className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto"
            >
              {downloading ? "Exporting..." : "Export CSV"}
            </button>

            <button
              onClick={exportPDF}
              disabled={downloading}
              className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 w-full sm:w-auto"
            >
              {downloading ? "Exporting..." : "Export PDF"}
            </button>

            <button
              onClick={exportZIP}
              disabled={downloading}
              className="text-sm px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 w-full sm:w-auto"
            >
              {downloading ? "Exporting..." : "Export ZIP"}
            </button>
          </div>
        </header>

        {/* Add Expense + Filters */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="col-span-1 lg:col-span-2 order-2 lg:order-1">
            <AddExpenseForm onAdd={addExpense} />
          </div>
          <div className="order-1 lg:order-2">
            <Filters
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              filterFrom={filterFrom}
              setFilterFrom={setFilterFrom}
              filterTo={filterTo}
              setFilterTo={setFilterTo}
              minAmount={minAmount}
              setMinAmount={setMinAmount}
              maxAmount={maxAmount}
              setMaxAmount={setMaxAmount}
              query={query}
              setQuery={setQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onClearAll={() => setExpenses([])}
            />
          </div>
        </section>

        {/*  Expenses + Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <ExpensesList
              expenses={filtered}
              onDelete={deleteExpense}
              onUpdate={updateExpense}
            />
          </div>
          <CategoryBreakdown totals={categoryTotals} budgets={budgets} />
        </section>

        {/*  Charts + Forecast */}
        <div className="space-y-6">
          <Charts
            categoryTotals={categoryTotals}
            labels={CATEGORIES}
            budgets={budgets}
          />
          <ForecastChart historyMonths={6} forecastMonths={6} />
        </div>

        {/*  Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          Data persisted locally (key: {STORAGE_KEY})
        </footer>
      </div>
    </div>
  );
}
