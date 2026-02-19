
// Mock service for handling user notifications

class NotificationService {
  constructor() {
    this.notifications = []; // In-memory storage for notifications
    this.listeners = [];
  }

  // Add a new notification and notify listeners
  addNotification(notification) {
    const newNotification = { id: Date.now(), ...notification };
    this.notifications.push(newNotification);
    this.emitChange();
    console.log('[NotificationService] Notification added:', newNotification);
  }

  // Get all notifications for a user
  getNotifications(userId) {
    // In a real app, this would filter by userId
    return Promise.resolve(this.notifications);
  }

  // Subscribe to changes
  subscribe(listener) {
    this.listeners.push(listener);
  }

  // Unsubscribe from changes
  unsubscribe(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  // Notify all listeners of a change
  emitChange() {
    this.listeners.forEach(listener => listener(this.notifications));
  }
}

export const notificationService = new NotificationService();
