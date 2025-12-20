import React, { useState } from 'react';
import styled from 'styled-components';
import Message from './Message';

const MessageListContainer = styled.div`
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
`;

const initialMessages = [
  { id: 1, text: 'Hi there!', sender: 'John Doe', timestamp: '10:31 AM', reactions: ['👍'], read: true },
  { id: 2, text: 'Hello!', sender: 'me', timestamp: '10:32 AM', read: true },
  { id: 3, text: 'This message will disappear in 10 seconds.', sender: 'John Doe', timestamp: '10:33 AM', read: true, disappearingTimer: 10 },
  { id: 4, text: 'I am good, thanks! How about you?', sender: 'me', timestamp: '10:34 AM', read: true },
  { id: 5, text: 'Doing great! See you tomorrow!', sender: 'John Doe', timestamp: '10:35 AM', read: false },
  { id: 6, type: 'image', mediaUrl: 'https://i.pravatar.cc/300?img=1', sender: 'me', timestamp: '10:36 AM', read: false },
  { id: 7, type: 'image', mediaUrl: 'https://i.pravatar.cc/300?img=2', sender: 'John Doe', timestamp: '10:37 AM', read: false, viewOnce: true },
];

const MessageList = () => {
  const [messages, setMessages] = useState(initialMessages);

  const handleUpdateMessage = (id, newText) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, text: newText } : msg
    ));
  };

  const handleDeleteMessage = (id) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  return (
    <MessageListContainer>
      {messages.map(msg => (
        <Message 
            key={msg.id} 
            message={msg} 
            onUpdate={handleUpdateMessage} 
            onDelete={handleDeleteMessage} 
        />
      ))}
    </MessageListContainer>
  );
};

export default MessageList;
