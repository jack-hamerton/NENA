import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        const { data } = await api.get("/notifications");
        setNotifications(data);
      };

      fetchNotifications();

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

  const markAsRead = useCallback(async (notificationId) => {
    await api.post(`/notifications/${notificationId}/read`);
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  const clearReadNotifications = useCallback(async () => {
    await api.delete("/notifications/read");
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
