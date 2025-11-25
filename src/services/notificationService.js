import axios from "../axios";

export const getNotifications = async () => {
  const res = await axios.get("/notifications");
  return res.data;
};

export const markAsRead = async (id) => {
  const res = await axios.put(`/notifications/${id}/read`);
  return res.data;
};

export const deleteNotification = async (id) => {
  const res = await axios.delete(`/notifications/${id}`);
  return res.data;
};
