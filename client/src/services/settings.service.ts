import api from "@/lib/api";
import { UserSettings, SettingsUpdateResponse } from "@/types/settings";

export const settingsService = {
  getSettings: async () => {
    const response = await api.get<UserSettings>("/users/settings");
    return response.data;
  },

  updateSettings: async (settings: Partial<UserSettings>) => {
    const response = await api.put<SettingsUpdateResponse>("/users/settings", settings);
    return response.data;
  },
};
