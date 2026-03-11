"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { notificationService } from "@/services/notification.service";
import { Notification } from "@/types/notification";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  clearReadNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();

      // Connect to WebSocket for real-time updates
      // Note: In production, use an environment variable for the base URL
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host.replace(":3000", ":8000")}/api/v1/notifications/ws/${user.id}`;
      
      const ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const notificationData = JSON.parse(event.data);
          setNotifications(prev => [notificationData, ...prev]);
        } catch (error) {
          console.error("Error parsing notification WS message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("Notification WebSocket error:", error);
      };

      return () => {
        ws.close();
      };
    } else {
      setNotifications([]);
    }
  }, [user, fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const clearReadNotifications = async () => {
    try {
      await notificationService.clearReadNotifications();
      setNotifications(prev => prev.filter(n => !n.read));
    } catch (error) {
      console.error("Failed to clear read notifications:", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, clearReadNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
