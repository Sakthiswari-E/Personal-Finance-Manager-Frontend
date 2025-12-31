// // frontend/src/api.js
// import axios from "axios";

// //  Correct backend API base URL
// const raw = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "http://localhost:5002";
// const baseURL = `${raw}/api`; 
// console.log("✅ API baseURL:", baseURL);

// const api = axios.create({
//   baseURL,
//   withCredentials: false, 
// });

// // Always attach token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers = config.headers || {};
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// //  Detailed API errors
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err?.response?.status === 401) {
//       console.warn("⚠️ Unauthorized - maybe token expired");
//     }
//     console.error("❌ API Error:", {
//       url: err.config?.url,
//       method: err.config?.method,
//       status: err.response?.status,
//       message: err.response?.data,
//     });
//     return Promise.reject(err);
//   }
// );

// export default api;













// // frontend/src/api.js
// import axios from "axios";

// // ✅ Correct backend API base URL (no double /api problem)
// const raw = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "http://localhost:5002";
// const baseURL = `${raw}/api`; 
// console.log("✅ API baseURL:", baseURL);

// const api = axios.create({
//   baseURL,
//   withCredentials: true, // ✅ Enable cookies if needed
// });

// // ✅ Always attach JWT token in headers
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers = config.headers || {};
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ✅ Better error logging
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     console.error("❌ API Error:", {
//       url: err?.config?.url,
//       method: err?.config?.method,
//       status: err?.response?.status,
//       message: err?.response?.data,
//     });

//     if (err?.response?.status === 401) {
//       console.warn("⚠️ Unauthorized - maybe token expired");
//     }
//     return Promise.reject(err);
//   }
// );

// export default api;











import axios from "axios";

const raw =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") ||
  "http://localhost:5002";

const api = axios.create({
  baseURL: `${raw}/api`,
});

// ✅ SINGLE SOURCE OF AUTH
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("❌ API Error:", {
      url: err?.config?.url,
      status: err?.response?.status,
      message: err?.response?.data,
    });

    if (err?.response?.status === 401) {
      console.warn("⚠️ Token expired / invalid");
    }
    return Promise.reject(err);
  }
);

export default api;
