// frontend/src/layouts/MainLayout.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  const location = useLocation();
  const hideSidebarRoutes = ["/login", "/register"];

  // Hide sidebar if route is in the excluded list
  const hideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-[#0B1120] text-gray-100">
      {/* Sidebar visible only if user is inside dashboard pages */}
      {!hideSidebar && <Sidebar />}

      {/* Page Content */}
      <main
        className={`flex-1 p-6 overflow-y-auto ${
          !hideSidebar ? "md:ml-60" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
}
