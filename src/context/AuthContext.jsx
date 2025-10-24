// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api";
import toast from "react-hot-toast";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  //  Check auth on mount
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [token]);

  //  Verify logged-in user
  const checkAuth = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (err) {
      console.error("❌ Auth check failed:", err.response?.data || err.message);
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      if (!res.data?.token || !res.data?.user) {
        throw new Error("Invalid login response from server");
      }

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);
      setUser(user);

      toast.success(`Welcome back, ${user.name || "User"}!`);
      return user;
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  // Register
  const register = async (name, email, password) => {
    try {
      const res = await api.post("/auth/register", { name, email, password });

      if (!res.data?.token || !res.data?.user) {
        throw new Error("Invalid registration response from server");
      }

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);
      setUser(user);

      toast.success("Account created successfully!");
      return user;
    } catch (err) {
      console.error("❌ Registration error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  //  Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      console.warn("⚠️ Backend logout not implemented - continuing local logout");
    }

    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
    toast("Logged out!");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        setUser,
        setToken,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
