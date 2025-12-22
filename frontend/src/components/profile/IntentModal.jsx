
import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const IntentModal = ({ open, onClose, onFollow }) => {
  const [intent, setIntent] = useState('');

  const handleFollow = () => {
    onFollow(intent);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Why are you following this user?
        </Typography>
        <TextField
          id="intent"
          label="Intent"
          multiline
          rows={4}
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          variant="filled"
          fullWidth
        />
        <Button onClick={handleFollow}>Follow</Button>
      </Box>
    </Modal>
  );
};

export default IntentModal;
