// frontend/src/layouts/MainLayout.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  const location = useLocation();
  const hideSidebarRoutes = ["/login", "/register"];
  const hideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen w-full bg-[#F0F2F5]">
      
      {/* Sidebar */}
      {!hideSidebar && (
        <div className="w-60 bg-white border-r border-gray-200">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <main
        className={`
          flex-1 w-full
          px-4 md:px-6 pb-6 
          overflow-y-auto
          ${!hideSidebar ? "pt-6" : ""}
        `}
      >
        {children}
      </main>
    </div>
  );
}
