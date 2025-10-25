// frontend/src/components/Sidebar.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BarChart3,
  Wallet,
  Settings,
  ClipboardList,
  Target,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/dashboard" },
    { name: "Expenses", icon: <Wallet size={18} />, path: "/expenses" },
    { name: "Budgets", icon: <ClipboardList size={18} />, path: "/budgets" },
    { name: "Reports", icon: <BarChart3 size={18} />, path: "/reports" },
    { name: "Goals", icon: <Target size={18} />, path: "/goals" },
    { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
  ];

  return (
    <>
      {/* 🔥 Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-teal-500 text-white rounded-md shadow-md"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={22} />
      </button>

      {/* 🔥 Sidebar Overlay (Mobile Only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* ✅ Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: isOpen ? 0 : -250 }}
        transition={{ duration: 0.4 }}
        className="fixed left-0 top-0 h-full w-60 bg-[#0a0a0a] border-r border-gray-800 shadow-lg md:translate-x-0 z-50 md:z-0 md:relative flex flex-col py-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 mb-8">
          <h2 className="text-xl text-teal-400 font-semibold">PFM</h2>

          {/* Close Button for mobile */}
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-2 px-4">
          {links.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)} // Close on click mobile
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                pathname === item.path
                  ? "bg-teal-500/20 text-teal-400"
                  : "text-gray-300 hover:bg-teal-500/10 hover:text-white"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all px-6 py-3 rounded-lg mx-4 mt-auto"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </motion.aside>
    </>
  );
}
