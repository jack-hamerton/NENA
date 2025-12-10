
import { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

export const PinLock = ({ onUnlock }) => {
  const [pin, setPin] = useState('');

  const handlePinChange = (e) => {
    const newPin = e.target.value;
    if (newPin.length <= 4) {
      setPin(newPin);
    }
  };

  const handleSubmit = () => {
    // In a real app, you would verify the PIN against a stored value.
    if (pin === '1234') {
      onUnlock();
    }
    setPin('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Enter PIN</Typography>
      <TextField
        type="password"
        variant="outlined"
        inputProps={{ maxLength: 4, style: { textAlign: 'center', letterSpacing: '0.5em' } }}
        value={pin}
        onChange={handlePinChange}
        sx={{ mb: 2, width: '120px' }}
      />
      <Button variant="contained" onClick={handleSubmit}>Unlock</Button>
    </Box>
  );
};
