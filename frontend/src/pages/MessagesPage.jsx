import React, { useState } from 'react';
import styled from 'styled-components';
import ConversationList from '../messages/ConversationList';
import ChatWindow from '../messages/ChatWindow';
import CallWindow from '../messages/CallWindow';

const MessagesContainer = styled.div`
  display: flex;
  height: calc(100vh - 60px); // Adjust based on your header height
  background-color: #f0f2f5;
`;

const mockConversations = [
  { id: 1, name: 'John Doe', lastMessage: 'See you tomorrow!', timestamp: '10:30 AM', unread: 2, online: true, avatar: 'https://i.pravatar.cc/150?u=johndoe' },
  { id: 2, name: 'Jane Smith', lastMessage: 'Okay, sounds good.', timestamp: 'Yesterday', unread: 0, online: false, avatar: 'https://i.pravatar.cc/150?u=janesmith' },
];

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [activeCall, setActiveCall] = useState(null);

  const handleStartCall = (type) => {
    setActiveCall({ type, user: selectedConversation });
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  return (
    <MessagesContainer>
      <ConversationList
        conversations={mockConversations}
        selectedConversation={selectedConversation}
        onConversationSelect={setSelectedConversation}
      />
      <ChatWindow 
        conversation={selectedConversation} 
        onStartCall={handleStartCall} 
      />
      {activeCall && <CallWindow call={activeCall} onEndCall={handleEndCall} />}
    </MessagesContainer>
  );
};

export default MessagesPage;
