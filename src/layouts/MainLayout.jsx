// frontend/src/layouts/MainLayout.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  const location = useLocation();
  const hideSidebarRoutes = ["/login", "/register"];
  const hideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-[#0B1120] text-gray-100">
      {/* ✅ Sidebar (show on all pages except login/register) */}
      {!hideSidebar && (
        <aside className="w-60 fixed left-0 top-0 h-full z-40">
          <Sidebar />
        </aside>
      )}

      {/* ✅ Page Content */}
      <main
        className={`flex-1 min-h-screen overflow-y-auto p-6 transition-all duration-300 ${
          !hideSidebar ? "md:ml-60" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
}


