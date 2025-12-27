
import React, { useState } from 'react';
import { Modal, Box, Typography, Button, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';

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

const INTENT_CATEGORIES = [
  'Collaborator', // For peers you want to work with
  'Mentor',       // For users you look up to for guidance
  'Peer'          // For users who share similar interests or roles
];

const IntentModal = ({ open, onClose, onFollow }) => {
  const [intent, setIntent] = useState('');

  const handleFollow = () => {
    if (intent) {
      onFollow(intent);
      onClose();
    }
    // Optional: Add user feedback if no intent is selected
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box sx={style}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          How do you see this user?
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="follow-intent"
            name="follow-intent-group"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
          >
            {INTENT_CATEGORIES.map((category) => (
              <FormControlLabel key={category} value={category} control={<Radio />} label={category} />
            ))}
          </RadioGroup>
        </FormControl>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleFollow} disabled={!intent}>
            Follow
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default IntentModal;
