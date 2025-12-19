
import React, { useState, useEffect } from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import { userService } from '../services/userService';

const SettingsPage = () => {
  const [callSettings, setCallSettings] = useState('anyone');

  useEffect(() => {
    // Fetch user's current call settings
    const fetchSettings = async () => {
      try {
        const settings = await userService.getCallSettings();
        setCallSettings(settings.call_setting);
      } catch (error) {
        console.error('Error fetching call settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (event) => {
    setCallSettings(event.target.value);
  };

  const handleSave = async () => {
    try {
      await userService.updateCallSettings({ call_setting: callSettings });
      alert('Settings saved!');
    } catch (error) {
      console.error('Error saving call settings:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Call Settings</Typography>
      <Typography sx={{ mb: 1 }}>Who can call you?</Typography>
      <RadioGroup value={callSettings} onChange={handleChange}>
        <FormControlLabel value="anyone" control={<Radio />} label="Anyone" />
        <FormControlLabel value="friends" control={<Radio />} label="Friends" />
        <FormControlLabel value="none" control={<Radio />} label="No one" />
      </RadioGroup>
      <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>Save</Button>
    </Box>
  );
};

export default SettingsPage;
