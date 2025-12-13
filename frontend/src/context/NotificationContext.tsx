import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';

interface Notification {
  id: number;
  read: boolean;
  type: string;
  payload: any;
}

interface NotificationContextType {
  notifications: Notification[];
  clearReadNotifications: () => void;
  markAsRead: (notificationId: number) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

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
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (user) {
      const ws = new WebSocket(`ws://localhost:8000/notifications/ws/${user.id}`);

      ws.onmessage = (event) => {
        const notificationData = JSON.parse(event.data);
        const newNotification = {
          ...notificationData,
          id: new Date().getTime(), // Add a unique ID
          read: false,
        };
        setNotifications(prev => [...prev, newNotification]);
      };

      return () => {
        ws.close();
      };
    }
  }, [user]);

  const markAsRead = useCallback((notificationId: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  const clearReadNotifications = useCallback(() => {
    setNotifications(prev => prev.filter(n => !n.read));
  }, []);

  useEffect(() => {
    const unreadNotifications = notifications.filter(n => !n.read);
    const latestNotification = unreadNotifications[unreadNotifications.length - 1];

    if (latestNotification) {
      if (latestNotification.type === 'event_invitation') {
        const { event, message } = latestNotification.payload;
        enqueueSnackbar(message, {
          action: (
            <Button
              onClick={async () => {
                await api.post(`/calendar/events/${event.id}/respond?accept=true`, {}, {});
                markAsRead(latestNotification.id);
              }}
            >
              Accept
            </Button>
          ),
        });
      } else if (latestNotification.type === 'event_reminder') {
        const { message } = latestNotification.payload;
        enqueueSnackbar(message, {
          action: (
            <Button
              onClick={() => {
                window.location.href = '/calendar';
                markAsRead(latestNotification.id);
              }}
            >
              View
            </Button>
          ),
        });
      }
    }
  }, [notifications, enqueueSnackbar, markAsRead]);


  const contextValue = {
    notifications,
    clearReadNotifications,
    markAsRead
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
