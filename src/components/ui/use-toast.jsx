// src/components/ui/use-toast.jsx
import { useState, useCallback } from "react";

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const Toast = () =>
    toast ? (
      <div
        className={`fixed top-5 right-5 px-4 py-2 rounded text-white shadow-lg z-50 ${
          toast.type === "success"
            ? "bg-green-500"
            : toast.type === "error"
            ? "bg-red-500"
            : toast.type === "warning"
            ? "bg-yellow-500"
            : "bg-blue-500"
        }`}
      >
        {toast.message}
      </div>
    ) : null;

  return { showToast, Toast };
}
