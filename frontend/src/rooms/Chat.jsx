import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const MessageList = styled.div`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
`;

const Message = styled.div`
  margin-bottom: 10px;
`;

const MessageSender = styled.span`
  font-weight: bold;
`;

const MessageText = styled.span`
  margin-left: 10px;
`;

const ChatInputContainer = styled.form`
  display: flex;
  padding: 20px;
`;

const ChatInput = styled.input`
  flex-grow: 1;
  padding: 10px;
`;

const SendButton = styled.button`
  margin-left: 10px;
  padding: 10px;
`;

export const Chat = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:8000/api/ws/${roomId}`);

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    return () => {
      ws.current.close();
    };
  }, [roomId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    ws.current.send(JSON.stringify({ text: newMessage }));
    setNewMessage('');
  };

  return (
    <ChatContainer>
      <MessageList>
        {messages.map((msg, index) => (
          <Message key={index}>
            <MessageSender>{msg.sender}:</MessageSender>
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
        <SendButton type="submit">Send</SendButton>
      </ChatInputContainer>
    </ChatContainer>
  );
};
