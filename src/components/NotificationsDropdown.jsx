// // frontend/src/components/NotificationsDropdown.jsx
// import { useState, useRef, useEffect } from "react";
// import { useNotifications } from "../context/NotificationsContext";
// import { Bell, CheckCheck } from "lucide-react";

// const NotificationsDropdown = () => {
//   const {
//     notifications,
//     unreadCount,
//     markAsRead,
//     markAllAsRead,
//     loading,
//   } = useNotifications();

//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef();

//   // Close on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         onClick={() => setOpen((prev) => !prev)}
//         className="relative p-2 hover:bg-gray-100 rounded-full duration-200"
//       >
//         <Bell className="w-6 h-6" />
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {open && (
//         <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg border p-2 z-50">
//           <div className="flex justify-between items-center px-2 py-1 border-b">
//             <h2 className="font-semibold text-gray-700">Notifications</h2>

//             {unreadCount > 0 && (
//               <button
//                 onClick={markAllAsRead}
//                 className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
//               >
//                 <CheckCheck size={16} /> Mark all as read
//               </button>
//             )}
//           </div>

//           {loading && (
//             <p className="text-center py-4 text-gray-500">
//               Loading notifications...
//             </p>
//           )}

//           {!loading && notifications.length === 0 && (
//             <p className="text-center py-4 text-gray-500">
//               No notifications found.
//             </p>
//           )}

//           <div className="max-h-80 overflow-y-auto">
//             {notifications.map((n) => (
//               <div
//                 key={n._id}
//                 onClick={() => !n.isRead && markAsRead(n._id)}
//                 className={`p-3 border-b cursor-pointer transition ${
//                   n.isRead ? "bg-white" : "bg-blue-50"
//                 }`}
//               >
//                 <p className="text-sm text-gray-800">{n.message}</p>
//                 <p className="text-xs text-gray-500 mt-1">
//                   {new Date(n.createdAt).toLocaleString()}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationsDropdown;

//frontend\src\components\NotificationsDropdown.jsx
import { useState, useRef, useEffect } from "react";
import { useNotifications } from "../context/NotificationsContext";
import { Bell, CheckCheck } from "lucide-react";

const NotificationsDropdown = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    loading,
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 hover:bg-gray-100 rounded-full duration-200"
      >
        <Bell className="w-6 h-6" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg border p-2 z-50">
          <div className="flex justify-between items-center px-2 py-1 border-b">
            <h2 className="font-semibold text-gray-700">Notifications</h2>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
              >
                <CheckCheck size={16} /> Mark all as read
              </button>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <p className="text-center py-4 text-gray-500">
              Loading notifications...
            </p>
          )}

          {/* Empty State */}
          {!loading && notifications.length === 0 && (
            <p className="text-center py-4 text-gray-500">
              No notifications found.
            </p>
          )}

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => {
                  if (!n.isRead) markAsRead(n._id);
                }}
                className={`p-3 border-b cursor-pointer transition ${
                  n.isRead ? "bg-white" : "bg-blue-50"
                }`}
              >
                <p className="text-sm text-gray-800">{n.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;












// // frontend/src/components/NotificationsDropdown.jsx
// import { useState, useRef, useEffect } from "react";
// import { useNotifications } from "../context/NotificationsContext";
// import { Bell, CheckCheck } from "lucide-react";

// const NotificationsDropdown = () => {
//   const {
//     notifications,
//     unreadCount,
//     markAsRead,
//     markAllAsRead,
//     loading,
//   } = useNotifications();

//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef();

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative" ref={dropdownRef}>
//       {/* Bell Icon */}
//       <button
//         onClick={() => setOpen((prev) => !prev)}
//         className="relative p-2 hover:bg-gray-100 rounded-full duration-200"
//       >
//         <Bell className="w-6 h-6" />

//         {/* Unread Badge */}
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {/* Dropdown */}
//       {open && (
//         <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg border p-2 z-50">
//           <div className="flex justify-between items-center px-2 py-1 border-b">
//             <h2 className="font-semibold text-gray-700">Notifications</h2>

//             {unreadCount > 0 && (
//               <button
//                 onClick={markAllAsRead}
//                 className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
//               >
//                 <CheckCheck size={16} /> Mark all as read
//               </button>
//             )}
//           </div>

//           {/* Loading */}
//           {loading && (
//             <p className="text-center py-4 text-gray-500">
//               Loading notifications...
//             </p>
//           )}

//           {/* Empty */}
//           {!loading && notifications.length === 0 && (
//             <p className="text-center py-4 text-gray-500">
//               No notifications found.
//             </p>
//           )}

//           {/* List */}
//           <div className="max-h-80 overflow-y-auto">
//             {notifications.map((n) => (
//               <div
//                 key={n._id}
//                 onClick={() => {
//                   if (!n.isRead) {
//                     markAsRead(n._id);
//                   }
//                 }}
//                 className={`p-3 border-b cursor-pointer transition ${
//                   n.isRead ? "bg-white" : "bg-blue-50"
//                 }`}
//               >
//                 <p className="text-sm text-gray-800">{n.message}</p>
//                 <p className="text-xs text-gray-500 mt-1">
//                   {new Date(n.createdAt).toLocaleString()}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationsDropdown;
