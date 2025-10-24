// frontend/src/api.js
import axios from "axios";

//  Correct backend API base URL
const raw = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "http://localhost:5002/api";
const baseURL = `${raw}/api`; 
console.log("✅ API baseURL:", baseURL);

const api = axios.create({
  baseURL,
  withCredentials: false, 
});

// Always attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//  Detailed API errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      console.warn("⚠️ Unauthorized - maybe token expired");
    }
    console.error("❌ API Error:", {
      url: err.config?.url,
      method: err.config?.method,
      status: err.response?.status,
      message: err.response?.data,
    });
    return Promise.reject(err);
  }
);

export default api;
