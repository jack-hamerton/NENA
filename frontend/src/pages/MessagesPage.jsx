
import React, { useState, useEffect, useMemo } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import ConversationList from '../messages/ConversationList';
import ChatWindow from '../messages/ChatWindow';
import CallWindow from '../components/call/CallWindow';
import CallPopup from '../components/call/CallPopup';
import { theme } from '../theme/theme';

const MessagesContainer = styled.div`
  display: flex;
  height: calc(100vh - 60px);
  background-color: ${props => props.theme.palette.primary};
`;

const mockConversations = [
  { id: 1, name: 'John Doe', lastMessage: 'See you tomorrow!', timestamp: '10:30 AM', unread: 2, online: true, avatar: 'https://i.pravatar.cc/150?u=johndoe' },
  { id: 2, name: 'Jane Smith', lastMessage: 'Okay, sounds good.', timestamp: 'Yesterday', unread: 0, online: false, avatar: 'https://i.pravatar.cc/150?u=janesmith' },
];

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [activeCall, setActiveCall] = useState(null);
  const [showCallPopup, setShowCallPopup] = useState(false);

  const handleStartCall = (type) => {
    const callData = {
      to: selectedConversation.id,
      type: 'outgoing',
      callType: type
    };
    setActiveCall(callData);
    setShowCallPopup(false);
  };

  const handleHangUp = () => {
    setActiveCall(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <MessagesContainer>
        <ConversationList
          conversations={mockConversations}
          selectedConversation={selectedConversation}
          onConversationSelect={setSelectedConversation}
        />
        <ChatWindow 
          conversation={selectedConversation} 
          onStartCall={() => setShowCallPopup(true)}
        />
        {showCallPopup && 
          <CallPopup 
            user={selectedConversation} 
            onStartCall={handleStartCall} 
            onClose={() => setShowCallPopup(false)} 
          />
        }
        {activeCall && 
          <CallWindow 
            call={activeCall} 
            onHangUp={handleHangUp} 
          />
        }
      </MessagesContainer>
    </ThemeProvider>
  );
};

export default MessagesPage;
