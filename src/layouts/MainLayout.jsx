// //Frontend\src\layouts\MainLayout.jsx
// import React from "react";
// import { useLocation } from "react-router-dom";
// import Sidebar from "../components/Sidebar";

// export default function MainLayout({ children }) {
//   const location = useLocation();
//   const hideSidebarRoutes = ["/login", "/register"];
//   const hideSidebar = hideSidebarRoutes.includes(location.pathname);

//   return (
//     <div className="flex min-h-screen w-full bg-[#F0F2F5]">

//       {!hideSidebar && <Sidebar />}

//       <main
//         className={`
//           flex-1 w-full
//           px-4 md:px-6 pb-6 overflow-y-auto
//           ${!hideSidebar ? "pt-20 md:pt-6" : ""}
//         `}
//       >
//         {children}
//       </main>
//     </div>
//   );
// }



 //Frontend\src\layouts\MainLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  const location = useLocation();
  const hideSidebarRoutes = ["/login", "/register"];
  const hideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen w-full bg-[#F0F2F5]">
      {!hideSidebar && <Sidebar />}

      <main
        className={`
          flex-1 w-full
          px-4 md:px-6 pb-6 overflow-y-auto
          ${!hideSidebar ? "pt-20 md:pt-6" : ""}
        `}
      >
        {/* 🔥 THIS IS THE FIX */}
        <Outlet />
      </main>
    </div>
  );
}
