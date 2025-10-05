import React from "react";
import { Bell } from "lucide-react";

export default function NotificationsPanel({ notifications, onClear }) {
  if (!notifications.length)
    return (
      <div className="bg-white shadow rounded p-4 text-center text-gray-500">
        <Bell className="inline-block w-5 h-5 mr-2" />
        No new notifications
      </div>
    );

  return (
    <div className="bg-white shadow rounded p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </h2>
        <button
          onClick={onClear}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear all
        </button>
      </div>

      <ul className="space-y-2 max-h-60 overflow-y-auto">
        {notifications.map((n, i) => (
          <li
            key={i}
            className={`p-3 rounded text-sm border-l-4 ${
              n.type === "warning"
                ? "bg-yellow-50 border-yellow-400 text-yellow-800"
                : n.type === "success"
                ? "bg-green-50 border-green-400 text-green-800"
                : "bg-blue-50 border-blue-400 text-blue-800"
            }`}
          >
            <span className="font-medium">{n.title}</span>
            <p className="text-gray-700">{n.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
