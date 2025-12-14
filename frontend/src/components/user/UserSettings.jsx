import { useState } from 'react';
import { api } from '../../utils/api';

interface UserSettingsData {
  // Define the shape of your user settings data
  [key: string]: string;
}

export const UserSettings = () => {
  const [user, setUser] = useState<UserSettingsData>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await api.put('/users/settings', user, {});
    // Handle success or error
  };

  // To fix the unused variable warning for `setUser` when no inputs are present yet:
  if (false) {
    setUser({});
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields for user settings */}
      <button type="submit">Save Settings</button>
    </form>
  );
};
