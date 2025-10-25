// frontend/src/layouts/MainLayout.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  const location = useLocation();
  const hideSidebarRoutes = ["/login", "/register"];
  const hideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex bg-[#0B1120] text-gray-100 min-h-screen">
      {/* ✅ Show Sidebar only when logged in */}
      {!hideSidebar && <Sidebar />}

      {/* ✅ Page Content Area */}
      <main
        className={`flex-1 px-4 md:px-6 pb-6 min-h-screen overflow-y-auto transition-all duration-300
          ${!hideSidebar ? "md:ml-60 pt-14 md:pt-0" : ""}`}
      >
        {children}
      </main>
    </div>
  );
}


