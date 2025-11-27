// // frontend/src/layouts/MainLayout.jsx
// import React from "react";
// import { useLocation } from "react-router-dom";
// import Sidebar from "../components/Sidebar";

// export default function MainLayout({ children }) {
//   const location = useLocation();

//   // Pages where sidebar + navbar should be hidden
//   const hideSidebarRoutes = ["/login", "/register"];
//   const hideSidebar = hideSidebarRoutes.includes(location.pathname);

//   return (
//     <div className="flex min-h-screen w-full bg-[#F0F2F5]">

//       {/* 🌐 SIDEBAR — only for desktop */}
//       {!hideSidebar && (
//         <div className="hidden md:flex md:w-60 bg-white border-r border-gray-200">
//           <Sidebar />
//         </div>
//       )}

//       {/* 🌐 MAIN WRAPPER */}
//       <div className="flex-1 flex flex-col w-full">

//         {/* 🌐 NAVBAR — visible on ALL SCREENS */}
//         {!hideSidebar && <Navbar />}

//         {/* 🌐 PAGE CONTENT */}
//         <main
//           className={`
//             flex-1 w-full 
//             px-4 md:px-6 pb-6 
//             overflow-y-auto
//             ${!hideSidebar ? "pt-4" : ""}
//           `}
//         >
//           {children}
//         </main>

//       </div>
//     </div>
//   );
// }


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
      {/* Sidebar (desktop only) */}
      {!hideSidebar && (
        <div className="hidden md:flex md:w-60 bg-white border-r border-gray-200">
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
