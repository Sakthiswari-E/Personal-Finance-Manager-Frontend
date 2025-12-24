import api from "../api";

// Get all income
export const getIncome = () => api.get("/income");

// Add income
export const addIncome = (data) => api.post("/income", data);

// Income summary
export const getIncomeSummary = () => api.get("/income/summary");

// Monthly income
export const getMonthlyIncome = () => api.get("/income/monthly");
