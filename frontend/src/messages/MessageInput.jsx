
import React, { useState } from 'react';
import styled from 'styled-components';
import { Menu, MenuItem } from '@mui/material';
import { rewriteText } from '../services/aiService';

const MessageInputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid ${props => props.theme.palette.highlight};
  background-color: ${props => props.theme.palette.primary};
`;

const Input = styled.input`
  flex-grow: 1;
  border: 1px solid ${props => props.theme.palette.highlight};
  border-radius: 20px;
  padding: 0.8rem;
  font-size: 1rem;
  background-color: ${props => props.theme.palette.secondary};
  color: ${props => props.theme.text.primary};
`;

const SendButton = styled.button`
  background-color: ${props => props.theme.palette.secondary};
  color: ${props => props.theme.text.primary};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-left: 1rem;
  cursor: pointer;
  font-size: 1.2rem;
`;

const AttachmentButton = styled.label`
  background-color: ${props => props.theme.palette.secondary};
  color: ${props => props.theme.text.primary};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-right: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;

  input[type="file"] {
      display: none;
  }
`;

const AiAssistButton = styled.button`
  background-color: ${props => props.theme.palette.secondary};
  color: ${props => props.theme.text.primary};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-left: 1rem;
  cursor: pointer;
  font-size: 1.2rem;
`;

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAiAssistClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAiAssistClose = () => {
    setAnchorEl(null);
  };

  const handleRewrite = async (tone) => {
    const rewrittenText = await rewriteText(message, tone);
    setMessage(rewrittenText);
    handleAiAssistClose();
  };

  return (
    <MessageInputContainer>
      <AttachmentButton>
        +
        <input type="file" />
      </AttachmentButton>
      <Input type="text" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} />
      <AiAssistButton
        aria-controls="ai-assist-menu"
        aria-haspopup="true"
        onClick={handleAiAssistClick}
      >
        AI
      </AiAssistButton>
      <Menu
        id="ai-assist-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleAiAssistClose}
      >
        <MenuItem onClick={() => handleRewrite('formal')}>Formal</MenuItem>
        <MenuItem onClick={() => handleRewrite('friendly')}>Friendly</MenuItem>
        <MenuItem onClick={() => handleRewrite('respectful')}>Respectful</MenuItem>
        <MenuItem onClick={() => handleRewrite('concise')}>Concise</MenuItem>
      </Menu>
      <SendButton>➤</SendButton>
    </MessageInputContainer>
  );
};

export default MessageInput;
