
import React, { createContext, useState, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  // State will now be an object where keys are user IDs
  const [userNotifications, setUserNotifications] = useState({});
  const { user } = useAuth();

  const addNotification = useCallback((message) => {
    if (!user) return; // Do nothing if no user is logged in

    const newNotification = {
      id: new Date().getTime(),
      message,
      read: false,
    };

    setUserNotifications(prev => ({
      ...prev,
      [user.id]: [newNotification, ...(prev[user.id] || [])],
    }));
  }, [user]);

  const markAsRead = useCallback((notificationId) => {
    if (!user) return;

    setUserNotifications(prev => {
      const currentUserNotifications = prev[user.id] || [];
      return {
        ...prev,
        [user.id]: currentUserNotifications.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        ),
      };
    });
  }, [user]);

  // The hook will now return only the notifications for the logged-in user
  const notifications = user ? userNotifications[user.id] || [] : [];

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
