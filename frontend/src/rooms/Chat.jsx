
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Menu, MenuItem } from '@mui/material';
import { rewriteText } from '../services/aiService'; // Assuming aiService is correctly pathed

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${props => props.theme.palette.primary};
  color: ${props => props.theme.text.primary};
`;

const MessageList = styled.div`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
`;

const Message = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
`;

const MessageSender = styled.span`
  font-weight: bold;
  color: ${props => props.theme.text.secondary};
  margin-bottom: 4px;
`;

const MessageText = styled.span`
  background-color: ${props => props.theme.palette.secondary};
  padding: 10px;
  border-radius: 10px;
  max-width: 80%;
`;

const ChatInputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid ${props => props.theme.palette.highlight};
`;

const ChatInput = styled.input`
  flex-grow: 1;
  border: 1px solid ${props => props.theme.palette.highlight};
  border-radius: 20px;
  padding: 0.8rem;
  font-size: 1rem;
  background-color: ${props => props.theme.palette.secondary};
  color: ${props => props.theme.text.primary};
  margin-right: 1rem;
`;

const AiAssistButton = styled.button`
  background-color: ${props => props.theme.palette.secondary};
  color: ${props => props.theme.text.primary};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-right: 1rem;
  cursor: pointer;
  font-size: 1.2rem;
`;

const SendButton = styled.button`
  background-color: ${props => props.theme.palette.accent};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 1.2rem;
`;

export const Chat = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:8000/api/ws/${roomId}`);
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    return () => ws.current.close();
  }, [roomId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    ws.current.send(JSON.stringify({ text: newMessage }));
    setNewMessage('');
  };

  const handleAiAssistClick = (event) => setAnchorEl(event.currentTarget);
  const handleAiAssistClose = () => setAnchorEl(null);

  const handleRewrite = async (tone) => {
    if (!newMessage) return;
    const rewrittenText = await rewriteText(newMessage, tone);
    setNewMessage(rewrittenText);
    handleAiAssistClose();
  };

  return (
    <ChatContainer>
      <MessageList>
        {messages.map((msg, index) => (
          <Message key={index}>
            <MessageSender>{msg.sender || 'User'}:</MessageSender>
            <MessageText>{msg.text}</MessageText>
          </Message>
        ))}
      </MessageList>
      <ChatInputContainer onSubmit={handleSendMessage}>
        <ChatInput
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <AiAssistButton
          type="button" // Prevent form submission
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
        <SendButton type="submit">➤</SendButton>
      </ChatInputContainer>
    </ChatContainer>
  );
};
