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
      {/* ✅ MOBILE TOP NAV */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#0a0a0a] border-b border-gray-800 z-50 flex items-center justify-between px-4 py-3">
        <h2 className="text-xl text-teal-400 font-semibold">PFM</h2>
        <button
          className="text-gray-300"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* ✅ MOBILE SLIDE DOWN MENU */}
      {isOpen && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          transition={{ duration: 0.3 }}
          className="md:hidden fixed top-14 left-0 right-0 bg-[#0a0a0a] border-b border-gray-800 shadow-lg z-40 flex flex-col"
        >
          {links.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-6 py-3 transition ${
                pathname === item.path
                  ? "bg-teal-500/20 text-teal-400"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </motion.div>
      )}

      {/* ✅ DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-60 bg-[#0a0a0a] border-r border-gray-800 h-screen py-6 sticky top-0">
        <h2 className="text-2xl text-teal-400 font-semibold px-6 mb-8">
          PFM
        </h2>

        <nav className="flex flex-col gap-2 px-4">
          {links.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                pathname === item.path
                  ? "bg-teal-500/20 text-teal-400"
                  : "text-gray-300 hover:bg-teal-500/10 hover:text-white"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition px-6 py-3 rounded-lg mt-auto mx-4"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>
    </>
  );
}
