import axios from "axios";

//  Base API setup
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle expired access tokens via refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          "http://localhost:5001/api/auth/refresh",
          { refreshToken }
        );

        localStorage.setItem("token", data.token);
        originalRequest.headers["Authorization"] = `Bearer ${data.token}`;
        return API(originalRequest);
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;

/* -------------------- AUTH -------------------- */
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

/* -------------------- TRANSACTIONS -------------------- */
export const getTransactions = () => API.get("/transactions");
export const addTransaction = (data) => API.post("/transactions", data);

/* -------------------- BUDGETS -------------------- */
export const getBudgets = () => API.get("/budgets");
export const addBudget = (data) => API.post("/budgets", data);
export const updateBudget = (id, data) => API.put(`/budgets/${id}`, data);
export const deleteBudget = (id) => API.delete(`/budgets/${id}`);

/* -------------------- EXPENSES -------------------- */
export const getExpenses = () => API.get("/expenses");
export const addExpense = (data) => API.post("/expenses", data);
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);

/* -------------------- GOALS -------------------- */

export const getGoals = () => API.get("/goals");
export const addGoal = (data) =>
  API.post("/goals", {
    title: data.title,
    targetAmount: data.targetAmount,
    currentAmount: data.currentAmount || 0,
    deadline: data.deadline,
  });
export const updateGoal = (id, data) =>
  API.put(`/goals/${id}`, {
    title: data.title,
    targetAmount: data.targetAmount,
    currentAmount: data.currentAmount || 0,
    deadline: data.deadline,
  });
export const deleteGoal = (id) => API.delete(`/goals/${id}`);

/* -------------------- FORECAST -------------------- */
export const getForecast = (historyMonths = 6, forecastMonths = 6) =>
  API.get(
    `/forecast?historyMonths=${historyMonths}&forecastMonths=${forecastMonths}`
  );
