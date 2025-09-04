import React, { createContext, useContext, useState, ReactNode } from "react";

export type Notification = {
  id: string;
  type: "info" | "success" | "warning" | "error" | "inquiry";
  title: string;
  message: string;
  timestamp: Date;
  read?: boolean;
  inquiryId?: string; // Add inquiryId property
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "timestamp"> & { id?: string, timestamp?: Date }) => void;
  markAllAsRead: () => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id" | "timestamp"> & { id?: string, timestamp?: Date }) => {
    // Check if notification with this ID already exists
    if (notification.id && notifications.some(n => n.id === notification.id)) {
      // Update existing notification
      setNotifications(prev => prev.map(n => 
        n.id === notification.id ? { ...n, ...notification } as Notification : n
      ));
    } else {
      // Add new notification
      setNotifications((prev) => [
        {
          ...notification,
          id: notification.id || Math.random().toString(36).substr(2, 9),
          timestamp: notification.timestamp || new Date(),
          read: notification.read || false,
        } as Notification,
        ...prev,
      ]);
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const updateNotification = (id: string, updates: Partial<Notification>) => {
    setNotifications((prev) => 
      prev.map((n) => n.id === id ? { ...n, ...updates } : n)
    );
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllAsRead, updateNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};