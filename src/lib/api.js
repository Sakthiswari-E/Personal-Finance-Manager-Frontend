import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api`
    : "http://localhost:5001/api",
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.warn("⚠️ No refresh token — redirecting to login");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001"}/api/auth/refresh`,
          { refreshToken }
        );

        if (data?.token) {
          localStorage.setItem("token", data.token);
          originalRequest.headers["Authorization"] = `Bearer ${data.token}`;
          return API(originalRequest); 
        } else {
          throw new Error("No token in refresh response");
        }
      } catch (err) {
        console.error("Refresh token invalid:", err.message);
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

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

export const getTransactions = () => API.get("/transactions");
export const addTransaction = (data) => API.post("/transactions", data);

export const getBudgets = () => API.get("/budgets");
export const addBudget = (data) => API.post("/budgets", data);
export const updateBudget = (id, data) => API.put(`/budgets/${id}`, data);
export const deleteBudget = (id) => API.delete(`/budgets/${id}`);

export const getExpenses = () => API.get("/expenses");
export const addExpense = (data) => API.post("/expenses", data);

export const deleteExpense = (expense) => {
  const id = expense?._id || expense?.id;
  if (!id) {
    console.error(" Missing expense ID for deletion:", expense);
    throw new Error("Missing expense ID");
  }
  return API.delete(`/expenses/${id}`);
};

export const updateExpense = (expense) => {
  const id = expense?._id || expense?.id;
  if (!id) {
    console.error(" Missing expense ID for update:", expense);
    throw new Error("Missing expense ID");
  }
  return API.put(`/expenses/${id}`, expense);
};

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

export const getForecast = (historyMonths = 6, forecastMonths = 6) =>
  API.get(`/forecast?historyMonths=${historyMonths}&forecastMonths=${forecastMonths}`);

export const getProfile = () => API.get("/profile");
export const updateProfile = (data) => API.put("/profile", data);
