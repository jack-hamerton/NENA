
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { chatService } from '../services/chatService.js';

const DisappearingMessage = ({ message }) => {
  const [timeLeft, setTimeLeft] = useState(message.disappearingTimer || 0);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            chatService.deleteMessage(message.id);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, message.id]);

  if (timeLeft <= 0) {
    return null;
  }

  return (
    <Box sx={{ position: 'relative', display:'inline-block' }}>
        {message.text}
        <Typography variant="caption" sx={{ position: 'absolute', bottom: 0, right: 0 }}>
            {timeLeft}s
        </Typography>
    </Box>
  );
};

export default DisappearingMessage;
