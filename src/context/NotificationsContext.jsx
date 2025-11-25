import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ---- Fetch Notifications from API ---- //
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/api/notifications"); 
      const data = res.data || [];

      setNotifications(data);

      // count unread notifications
      const unread = data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setLoading(false);
    }
  };

  // ---- Mark One Notification Read ---- //
  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}`, { isRead: true });

      // update local state instantly
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );

      // recalc unread count
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Mark as read failed:", error);
    }
  };

  // ---- Mark ALL Notifications Read ---- //
  const markAllAsRead = async () => {
    try {
      await axios.patch("/api/notifications/mark-all");

      // update local
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  // ---- Auto Refresh Notifications (20 sec) ---- //
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

// custom hook
export const useNotifications = () => useContext(NotificationsContext);
