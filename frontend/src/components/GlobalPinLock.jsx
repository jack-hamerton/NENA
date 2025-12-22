
import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

const GlobalPinLock = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handlePinChange = (e) => {
    const newPin = e.target.value;
    // Allow only numeric input and limit to 4 digits
    if (/^[0-9]*$/.test(newPin) && newPin.length <= 4) {
      setPin(newPin);
      setError(''); // Clear error on new input
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('app_pin');

    if (pin === storedPin) {
      onUnlock();
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin(''); // Clear the input field
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        width: '100vw',
        backgroundColor: 'rgba(0, 0, 0, 0.9)' 
      }}
    >
      <Paper 
        elevation={6}
        sx={{
          padding: '2rem 3rem',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'neutral.main'
        }}
      >
        <Typography variant="h5" component="h1" sx={{ mb: 2, color: 'text.primary' }}>
          Enter PIN to Unlock
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            type="password"
            variant="outlined"
            inputProps={{ 
              maxLength: 4, 
              style: { 
                textAlign: 'center', 
                fontSize: '1.5rem',
                letterSpacing: '0.5em'
              } 
            }}
            value={pin}
            onChange={handlePinChange}
            autoFocus
            sx={{ mb: 2, width: '150px' }}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            fullWidth
            size="large"
            disabled={pin.length !== 4}
          >
            Unlock
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default GlobalPinLock;
