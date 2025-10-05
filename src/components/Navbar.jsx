import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react"; 
import toast from "react-hot-toast";

export default function NavbarLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Load notifications from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("notifications") || "[]");
    setNotifications(saved);
  }, []);

  //  Clear all notifications
  const clearNotifications = () => {
    localStorage.removeItem("notifications");
    setNotifications([]);
    toast.success("Notifications cleared");
  };

  const linkClass =
    "text-slate-600 hover:text-indigo-600 transition-colors duration-200";
  const activeClass = "text-indigo-600 font-semibold";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div
            className="text-xl font-semibold cursor-pointer"
            onClick={() => navigate("/")}
          >
            PFM
          </div>

          <nav className="space-x-4 flex items-center">
            {!token ? (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? `${linkClass} ${activeClass}` : linkClass
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? `${linkClass} ${activeClass}` : linkClass
                  }
                >
                  Register
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive ? `${linkClass} ${activeClass}` : linkClass
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/transactions"
                  className={({ isActive }) =>
                    isActive ? `${linkClass} ${activeClass}` : linkClass
                  }
                >
                  Transactions
                </NavLink>
                <NavLink
                  to="/budgets"
                  className={({ isActive }) =>
                    isActive ? `${linkClass} ${activeClass}` : linkClass
                  }
                >
                  Budgets
                </NavLink>
                <NavLink
                  to="/goals"
                  className={({ isActive }) =>
                    isActive ? `${linkClass} ${activeClass}` : linkClass
                  }
                >
                  Goals
                </NavLink>

                {/* Notifications Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown((prev) => !prev)}
                    className="relative text-slate-600 hover:text-indigo-600"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {/* Dropdown */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2">
                      <div className="flex justify-between items-center border-b pb-2 mb-2">
                        <h3 className="font-semibold text-gray-700 text-sm">
                          Notifications
                        </h3>
                        {notifications.length > 0 && (
                          <button
                            onClick={clearNotifications}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {notifications.length === 0 ? (
                          <p className="text-gray-500 text-sm text-center py-4">
                            No new notifications
                          </p>
                        ) : (
                          notifications
                            .slice()
                            .reverse()
                            .map((n, i) => (
                              <div
                                key={i}
                                className={`p-2 rounded-md text-sm border ${
                                  n.type === "warning"
                                    ? "border-yellow-300 bg-yellow-50"
                                    : n.type === "success"
                                    ? "border-green-300 bg-green-50"
                                    : "border-gray-200 bg-gray-50"
                                }`}
                              >
                                <div className="font-medium text-gray-800">
                                  {n.title}
                                </div>
                                <div className="text-gray-600 text-xs">
                                  {n.message}
                                </div>
                                <div className="text-gray-400 text-[10px] mt-1">
                                  {new Date(n.timestamp).toLocaleString()}
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate("/profile")}
                  className="text-sm px-3 py-1 bg-gray-200 rounded 
                  hover:text-indigo-400 transition"
                >
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="ml-2 text-red-600 hover:text-red-800 font-semibold"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 max-w-6xl mx-auto p-6 w-full">
        <Outlet />
      </main>
    </div>
  );
}
