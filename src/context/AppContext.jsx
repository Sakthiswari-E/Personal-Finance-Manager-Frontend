// frontend/src/context/AppContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api"; // this already includes baseURL = backend + /api

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [goals, setGoals] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  //  Fetch all goals + expenses
  const refreshData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("🔒 No token — skipping refresh");
      return;
    }

    try {
      setLoading(true);
      const [g, e] = await Promise.all([
        api.get("/goals"),    
        api.get("/expenses"),  
      ]);
      setGoals(g.data || []);
      setExpenses(e.data || []);
    } catch (err) {
      console.error("❌ Error refreshing data:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  //  Add new expense
  const addExpense = async (data) => {
    try {
      const res = await api.post("/expenses", data);
      const newExpense = res.data;
      setExpenses((prev) => [newExpense, ...prev]);
      return newExpense;
    } catch (err) {
      console.error("❌ Error adding expense:", err.response?.data || err.message);
      throw err;
    }
  };

  //  Update existing expense
  const updateExpense = async (id, updates) => {
    try {
      const res = await api.put(`/expenses/${id}`, updates);
      const updated = res.data;
      setExpenses((prev) =>
        prev.map((e) => (e._id === id ? { ...e, ...updated } : e))
      );
      return updated;
    } catch (err) {
      console.error("❌ Error updating expense:", err.response?.data || err.message);
      throw err;
    }
  };

  //  Delete expense
  const deleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("❌ Error deleting expense:", err.response?.data || err.message);
      throw err;
    }
  };

  //  Add new goal
  const addGoal = async (data) => {
    try {
      const res = await api.post("/goals", data);
      const newGoal = res.data;
      setGoals((prev) => [newGoal, ...prev]);
      return newGoal;
    } catch (err) {
      console.error("❌ Error adding goal:", err.response?.data || err.message);
      throw err;
    }
  };

  //  Update goal
  const updateGoal = async (id, updates) => {
    try {
      const res = await api.put(`/goals/${id}`, updates);
      const updated = res.data;
      setGoals((prev) =>
        prev.map((g) => (g._id === id ? { ...g, ...updated } : g))
      );
      return updated;
    } catch (err) {
      console.error("❌ Error updating goal:", err.response?.data || err.message);
      throw err;
    }
  };

  //  Delete goal
  const deleteGoal = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      setGoals((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      console.error("❌ Error deleting goal:", err.response?.data || err.message);
      throw err;
    }
  };

  //  Fetch everything on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) refreshData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        goals,
        expenses,
        loading,
        refreshData,
        addExpense,
        updateExpense,
        deleteExpense,
        addGoal,
        updateGoal,
        deleteGoal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
