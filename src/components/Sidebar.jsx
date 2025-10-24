// frontend/src/components/Sidebar.jsx
import React from "react";
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
} from "lucide-react";
import { useAuth } from "../context/AuthContext"; 

export default function Sidebar() {
  const { pathname } = useLocation();
  const { logout } = useAuth(); 

  const links = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/dashboard" },
    { name: "Expenses", icon: <Wallet size={18} />, path: "/expenses" },
    { name: "Budgets", icon: <ClipboardList size={18} />, path: "/budgets" },
    { name: "Reports", icon: <BarChart3 size={18} />, path: "/reports" },
    { name: "Goals", icon: <Target size={18} />, path: "/goals" },
    { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
  ];

  return (
    <motion.aside
      className="h-screen w-60 bg-[#0a0a0a] border-r border-gray-800 fixed left-0 top-0 flex flex-col py-6 justify-between"
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h2 className="text-xl text-teal-400 font-semibold px-6 mb-8">PFM</h2>
        <nav className="flex flex-col gap-2 px-4">
          {links.map((item) => (
            <Link
              key={item.path}
              to={item.path}
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

      <button
        onClick={logout}
        className="flex items-center gap-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all px-6 py-3 rounded-lg mx-4"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </motion.aside>
  );
}
