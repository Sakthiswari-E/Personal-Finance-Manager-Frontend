// frontend/src/components/PublicRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { user, loadingAuth } = useContext(AuthContext);

  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-400">
        Checking session...
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}
