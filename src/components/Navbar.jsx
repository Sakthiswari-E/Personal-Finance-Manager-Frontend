// frontend/src/components/Navbar.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Expenses", path: "/expenses" },
    { name: "Budgets", path: "/budgets" },
    { name: "Reports", path: "/reports" },
    { name: "Goals", path: "/goals" },
  ];

  return (
    <motion.nav
      className="w-full flex justify-between items-center px-8 py-4 bg-[#0d0d0d]/90 backdrop-blur-md border-b border-gray-800 fixed top-0 z-50"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Logo */}
      <Link to="/dashboard" className="text-xl font-bold text-white tracking-wide hover:text-teal-400 transition">
        💸 <span className="text-teal-400">PFM</span> Dashboard
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-6 items-center">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-gray-400 hover:text-white transition ${
              pathname === link.path ? "text-teal-400 font-semibold" : ""
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Notification + Settings + Logout */}
      <div className="flex gap-6 items-center relative">
        {/* 🔔 Notification Bell */}
        <div className="relative">
          <button
            className="text-gray-400 hover:text-white transition relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔
            {/* Red dot (example unread notification indicator) */}
            <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full"></span>
          </button>

          {/* Dropdown Notification Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg p-3">
              <p className="text-gray-300 text-sm">No new notifications</p>
            </div>
          )}
        </div>

        {/* Settings Button */}
        <button className="text-gray-400 hover:text-white transition">Settings</button>

        {/* Logout Button */}
        <button className="bg-teal-500 hover:bg-teal-600 text-black px-4 py-2 rounded-lg font-medium transition">
          Logout
        </button>
      </div>
    </motion.nav>
  );
}
