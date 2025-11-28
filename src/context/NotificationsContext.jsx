// frontend/src/context/NotificationsContext.jsx
import { createContext, useContext, useEffect, useState, useRef } from "react";
import api from "../api";

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const lastUpdateRef = useRef(0);

  // ---- Fetch Notifications ---- //
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      const data = res.data || [];

      if (Date.now() - lastUpdateRef.current < 800) return;

      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setLoading(false);
    }
  };

  // ---- Mark one ---- //
  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
      lastUpdateRef.current = Date.now();
    } catch (error) {
      console.error("Mark as read failed:", error);
    }
  };

  // ---- Mark all ---- //
  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/mark-all");

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );

      setUnreadCount(0);
      lastUpdateRef.current = Date.now();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

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