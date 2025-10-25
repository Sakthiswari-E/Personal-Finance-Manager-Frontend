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
      {/* MOBILE TOGGLE BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 bg-teal-500 text-black p-2 rounded-md z-50"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* SIDEBAR */}
      <motion.aside
        className="h-screen w-60 bg-[#0a0a0a] border-r border-gray-800 fixed top-0 left-0 flex flex-col justify-between py-6 z-40
                   md:translate-x-0 md:static"
        initial={{ x: -260 }}
        animate={{ x: isOpen ? 0 : -260 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo */}
        <div>
          <h2 className="text-2xl font-bold text-teal-400 px-6 mb-6">PFM</h2>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 px-4">
            {links.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
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
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all px-6 py-3 rounded-lg mx-4"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </motion.aside>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 md:hidden z-30"
        ></div>
      )}
    </>
  );
}
