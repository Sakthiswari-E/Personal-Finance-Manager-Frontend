// // frontend/src/components/Sidebar.jsx
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { Link, useLocation } from "react-router-dom";
// import {
//   Home,
//   BarChart3,
//   Wallet,
//   Settings,
//   ClipboardList,
//   Target,
//   LogOut,
//   Menu,
//   X,
// } from "lucide-react";
// import { useAuth } from "../context/AuthContext";

// export default function Sidebar() {
//   const { pathname } = useLocation();
//   const { logout } = useAuth();
//   const [isOpen, setIsOpen] = useState(false);

//   const links = [
//     { name: "Dashboard", icon: <Home size={18} />, path: "/dashboard" },
//     { name: "Expenses", icon: <Wallet size={18} />, path: "/expenses" },
//     { name: "Budgets", icon: <ClipboardList size={18} />, path: "/budgets" },
//     { name: "Reports", icon: <BarChart3 size={18} />, path: "/reports" },
//     { name: "Goals", icon: <Target size={18} />, path: "/goals" },
//     { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
//   ];

//   return (
//     <>
//       {/* 📱 MOBILE TOP NAV  */}
//       <div className="md:hidden fixed top-0 left-0 right-0 w-full bg-white
//         border-b border-[#E6E6E6] z-50 
//         flex items-center justify-between px-4 py-3">
//         <h2 className="text-xl text-[#111B21] font-semibold">PFM</h2>

//         <button
//           className="text-[#3B4A54]"
//           onClick={() => setIsOpen((prev) => !prev)}
//         >
//           {isOpen ? <X size={26} /> : <Menu size={26} />}
//         </button>
//       </div>

//       {/* 📱 MOBILE SLIDE MENU */}
//       {isOpen && (
//         <motion.div
//           initial={{ height: 0 }}
//           animate={{ height: "auto" }}
//           transition={{ duration: 0.3 }}
//           className="md:hidden fixed top-14 left-0 right-0 
//             bg-[#FFFFFF] border-b border-[#E6E6E6] shadow 
//             z-40 flex flex-col"
//         >
//           {links.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               onClick={() => setIsOpen(false)}
//               className={`flex items-center gap-3 px-6 py-3 transition rounded-lg
//                 ${
//                   pathname === item.path
//                     ? "bg-[#E8F5E9] text-[#111B21]"
//                     : "text-[#3B4A54] hover:bg-[#F5F5F5]"
//                 }`}
//             >
//               {item.icon}
//               {item.name}
//             </Link>
//           ))}

//           <button
//             onClick={logout}
//             className="flex items-center gap-3 px-6 py-3
//               text-[#667781] hover:text-[#24D366] hover:bg-[#F5F5F5] transition"
//           >
//             <LogOut size={18} /> Logout
//           </button>
//         </motion.div>
//       )}

//       {/* 💻 DESKTOP SIDEBAR */}
//       <aside
//         className="hidden md:flex flex-col w-60 
//         bg-[#FFFFFF] border-r border-[#E6E6E6] 
//         h-screen py-6 sticky top-0"
//       >
//         <h2 className="text-2xl text-[#111B21] font-semibold px-6 mb-8">
//           PFM
//         </h2>

//         {/* NAV LINKS */}
//         <nav className="flex flex-col gap-1 px-3">
//           {links.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
//                 ${
//                   pathname === item.path
//                     ? "bg-[#E8F5E9] text-[#111B21] border border-[#DCDCDC]"
//                     : "text-[#3B4A54] hover:bg-[#F5F5F5]"
//                 }`}
//             >
//               {item.icon}
//               {item.name}
//             </Link>
//           ))}
//         </nav>

//         {/* LOGOUT */}
//         <button
//           onClick={logout}
//           className="flex items-center gap-3 text-[#667781] 
//             hover:text-[#24D366] hover:bg-[#F5F5F5] 
//             transition px-6 py-3 rounded-lg mt-auto mx-4"
//         >
//           <LogOut size={18} /> Logout
//         </button>
//       </aside>
//     </>
//   );
// }









//frontend/src/components/Sidebar.jsx
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
      {/* 📱 MOBILE TOP NAV  */}
      <div className="md:hidden fixed top-0 left-0 right-0 w-full bg-white
        border-b border-[#E6E6E6] z-50 
        flex items-center justify-between px-4 py-3">
        <h2 className="text-xl text-[#111B21] font-semibold">PFM</h2>

        <button
          className="text-[#3B4A54]"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* 📱 MOBILE SLIDE MENU */}
      {isOpen && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          transition={{ duration: 0.3 }}
          className="md:hidden fixed top-14 left-0 right-0 
            bg-[#FFFFFF] border-b border-[#E6E6E6] shadow 
            z-40 flex flex-col"
        >
          {links.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-6 py-3 transition rounded-lg
                ${
                  pathname === item.path
                    ? "bg-[#E8F5E9] text-[#111B21]"
                    : "text-[#3B4A54] hover:bg-[#F5F5F5]"
                }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}

          {/* MOBILE LOGOUT */}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-6 py-3
              text-[#667781] hover:text-[#24D366] hover:bg-[#F5F5F5] transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </motion.div>
      )}

      {/* 💻 DESKTOP SIDEBAR */}
      <aside
        className="hidden md:flex flex-col w-60 
        bg-[#FFFFFF] border-r border-[#E6E6E6] 
        h-screen py-6 sticky top-0"
      >
        <h2 className="text-2xl text-[#111B21] font-semibold px-6 mb-8">
          PFM
        </h2>

        {/* DESKTOP NAV LINKS */}
        <nav className="flex flex-col gap-1 px-3">
          {links.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
                ${
                  pathname === item.path
                    ? "bg-[#E8F5E9] text-[#111B21] border border-[#DCDCDC]"
                    : "text-[#3B4A54] hover:bg-[#F5F5F5]"
                }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* DESKTOP LOGOUT */}
        <button
          onClick={logout}
          className="flex items-center gap-3 text-[#667781] 
            hover:text-[#24D366] hover:bg-[#F5F5F5] 
            transition px-6 py-3 rounded-lg mt-auto mx-4"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>
    </>
  );
}