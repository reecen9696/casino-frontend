import React, { createContext, useContext, useState, useCallback } from "react";
import { ToastContainer, type ToastData } from "./Toast";

interface ToastContextType {
  showToast: (toast: Omit<ToastData, "id">) => void;
  showError: (
    title: string,
    message?: string,
    action?: ToastData["action"]
  ) => void;
  showSuccess: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = {
      ...toast,
      id,
      duration: toast.duration ?? 5000, // Default 5 seconds
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const showError = useCallback(
    (title: string, message?: string, action?: ToastData["action"]) => {
      showToast({
        title,
        message,
        type: "error",
        duration: 8000, // Errors stay longer
        action,
      });
    },
    [showToast]
  );

  const showSuccess = useCallback(
    (title: string, message?: string) => {
      showToast({
        title,
        message,
        type: "success",
        duration: 4000, // Success messages are shorter
      });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (title: string, message?: string) => {
      showToast({
        title,
        message,
        type: "info",
        duration: 5000,
      });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{ showToast, showError, showSuccess, showInfo }}
    >
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}
