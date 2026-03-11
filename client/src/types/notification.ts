export type NotificationType = 
  | "event_invitation" 
  | "event_reminder" 
  | "new_message" 
  | "follow" 
  | "comment" 
  | "like";

export interface NotificationPayload {
  message: string;
  event?: {
    id: string;
    title: string;
    date: string;
    organizer?: string;
  };
  sender?: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  post_id?: string;
  episode_id?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  payload: NotificationPayload;
  read: boolean;
  created_at: string;
}
