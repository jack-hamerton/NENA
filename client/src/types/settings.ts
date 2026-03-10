export interface UserSettings {
  // Privacy
  profilePublic: boolean;
  allowMessages: boolean;
  onlineStatusPrivacy: 'everyone' | 'followers' | 'none';
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  activityReminders: boolean;
  
  // Display
  theme: 'light' | 'dark' | 'system';
  language: string;
}

export interface SettingsUpdateResponse {
  status: string;
  data: UserSettings;
}
