// frontend/src/components/Navbar.jsx
import React from "react";
import { Menu } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  return (
    <div className="w-full h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm sticky top-0 z-50">
      
      {/* Logo */}
      <div className="text-xl font-semibold text-blue-600">
        PFM
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>
      </div>
    </div>
  );
}
