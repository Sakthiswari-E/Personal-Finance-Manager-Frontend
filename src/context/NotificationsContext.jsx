// frontend/src/context/NotificationsContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api"; // ✅ Use your axios instance with token

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ---- Fetch Notifications ---- //
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications"); // ✅ FIXED
      const data = res.data || [];

      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setLoading(false);
    }
  };

  // ---- Mark One Notification Read ---- //
  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}`, { isRead: true }); // ✅ FIXED

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Mark as read failed:", error);
    }
  };

  // ---- Mark ALL Notifications Read ---- //
  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/mark-all"); // ✅ FIXED

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  // ---- Auto Refresh ---- //
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
