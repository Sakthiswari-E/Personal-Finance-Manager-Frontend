// src/pages/Landing.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to PFM</h1>
      <div className="space-x-4">
        <Link
          to="/login"
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
