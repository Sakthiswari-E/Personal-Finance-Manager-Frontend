// frontend/src/components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();


  if (loading) return <div className="text-center text-gray-300 mt-10">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
