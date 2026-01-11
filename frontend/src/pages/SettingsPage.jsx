import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { useSnackbar } from '../contexts/SnackbarContext';
import { api } from '../utils/api';

const SettingsPage = () => {
  const [hasPin, setHasPin] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const { showSnackbar } = useSnackbar();
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedPin = localStorage.getItem('app_pin');
    setHasPin(!!storedPin);
  }, []);

  const handleSetPin = () => {
    if (newPin.length !== 4) {
      showSnackbar('PIN must be 4 digits', 'error');
      return;
    }
    if (newPin !== confirmNewPin) {
      showSnackbar('PINs do not match', 'error');
      return;
    }

    localStorage.setItem('app_pin', newPin);
    setHasPin(true);
    setNewPin('');
    setConfirmNewPin('');
    showSnackbar('Application PIN has been set successfully', 'success');
  };

  const handleChangePin = () => {
    const storedPin = localStorage.getItem('app_pin');
    if (currentPin !== storedPin) {
      showSnackbar('Current PIN is incorrect', 'error');
      return;
    }
    if (newPin.length !== 4) {
      showSnackbar('New PIN must be 4 digits', 'error');
      return;
    }
    if (newPin !== confirmNewPin) {
      showSnackbar('New PINs do not match', 'error');
      return;
    }

    localStorage.setItem('app_pin', newPin);
    setCurrentPin('');
    setNewPin('');
    setConfirmNewPin('');
    showSnackbar('Application PIN has been changed successfully', 'success');
  };

  const handleRemovePin = () => {
    const storedPin = localStorage.getItem('app_pin');
    if (currentPin !== storedPin) {
      showSnackbar('Current PIN is incorrect', 'error');
      return;
    }

    localStorage.removeItem('app_pin');
    setHasPin(false);
    setCurrentPin('');
    showSnackbar('Application PIN has been removed', 'success');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put('/users/settings', user, {});
    // Handle success or error
  };


  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      <Paper sx={{ padding: '2rem', marginBottom: '2rem' }}>
        <Typography variant="h6" gutterBottom>User Settings</Typography>
        <form onSubmit={handleSubmit}>
          {/* Form fields for user settings */}
          <button type="submit">Save Settings</button>
        </form>
      </Paper>
      <Paper sx={{ padding: '2rem' }}>
        <Typography variant="h6" gutterBottom>Security Settings</Typography>
        {hasPin ? (
          // View for changing or removing PIN
          <Box>
            <Typography sx={{ mb: 2 }}>Change or remove your application PIN.</Typography>
            <TextField
              label="Current PIN"
              type="password"
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              inputProps={{ maxLength: 4 }}
              sx={{ mb: 2, display: 'block' }}
            />
            <TextField
              label="New PIN"
              type="password"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              inputProps={{ maxLength: 4 }}
              sx={{ mb: 2, display: 'block' }}
            />
            <TextField
              label="Confirm New PIN"
              type="password"
              value={confirmNewPin}
              onChange={(e) => setConfirmNewPin(e.target.value)}
              inputProps={{ maxLength: 4 }}
              sx={{ mb: 2, display: 'block' }}
            />
            <Button variant="contained" onClick={handleChangePin} sx={{ mr: 2 }}>Change PIN</Button>
            <Button variant="outlined" color="error" onClick={handleRemovePin}>Remove PIN</Button>
          </Box>
        ) : (
          // View for setting PIN
          <Box>
            <Typography sx={{ mb: 2 }}>Set a 4-digit PIN to secure your application.</Typography>
            <TextField
              label="New PIN"
              type="password"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              inputProps={{ maxLength: 4 }}
              sx={{ mb: 2, display: 'block' }}
            />
            <TextField
              label="Confirm New PIN"
              type="password"
              value={confirmNewPin}
              onChange={(e) => setConfirmNewPin(e.target.value)}
              inputProps={{ maxLength: 4 }}
              sx={{ mb: 2, display: 'block' }}
            />
            <Button variant="contained" onClick={handleSetPin}>Set PIN</Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default SettingsPage;
