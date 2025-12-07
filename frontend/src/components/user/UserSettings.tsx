import { useState, useEffect } from 'react';
import { api } from '../../utils/api';

export const UserSettings = () => {
  const [user, setUser] = useState({});

  // Fetch user data on mount

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put('/users/settings', user);
    // Handle success or error
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields for user settings */}
      <button type="submit">Save Settings</button>
    </form>
  );
};
