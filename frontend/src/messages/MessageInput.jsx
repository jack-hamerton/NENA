
import React, { useState } from 'react';
import { TextField, IconButton, Menu, MenuItem } from '@mui/material';
import { Send, Add, Assistant } from '@mui/icons-material';
import styled from 'styled-components';
import { aiService } from '../services/aiService.js';

const MessageInputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
`;

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleAiAssistClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAiAssistClose = () => {
    setAnchorEl(null);
  };

  const handleRewrite = async (tone) => {
    handleAiAssistClose();
    if (!message.trim()) return;
    try {
      const rewrittenText = await aiService.rewriteText(message, tone);
      setMessage(rewrittenText);
    } catch (error) {
      console.error('Error rewriting text:', error);
    }
  };

  return (
    <MessageInputContainer>
      <IconButton>
        <Add />
      </IconButton>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
      />
      <IconButton onClick={handleAiAssistClick}>
        <Assistant />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleAiAssistClose}
      >
        <MenuItem onClick={() => handleRewrite('formal')}>Formal</MenuItem>
        <MenuItem onClick={() => handleRewrite('friendly')}>Friendly</MenuItem>
        <MenuItem onClick={() => handleRewrite('respectful')}>Respectful</MenuItem>
        <MenuItem onClick={() => handleRewrite('concise')}>Concise</MenuItem>
      </Menu>
      <IconButton onClick={handleSendMessage}>
        <Send />
      </IconButton>
    </MessageInputContainer>
  );
};

export default MessageInput;
