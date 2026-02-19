
import React, { useState, useEffect } from 'react';
import { Grid, useTheme, useMediaQuery } from '@mui/material';
import ConversationList from '../messages/ConversationList';
import ChatWindow from '../messages/ChatWindow';
import AIChat from '../components/AIChat';
import CallPopup from '../components/call/CallPopup';
import CallWindow from '../components/call/CallWindow';
import { chatService } from '../services/chatService.js'; 

const mockConversations = [
    {
      id: 1,
      name: 'John Doe',
      lastMessage: 'See you tomorrow!',
      timestamp: '10:30 AM',
      unread: 2,
      online: true,
      avatar: 'https://i.pravatar.cc/150?u=johndoe',
      participants: [{ id: 'user2', name: 'John Doe'}]
    },
    {
        id: 2,
        name: 'Jane Smith',
        lastMessage: 'Just finished the report.',
        timestamp: 'Yesterday',
        unread: 0,
        online: false,
        avatar: 'https://i.pravatar.cc/150?u=janesmith',
        participants: [{ id: 'user3', name: 'Jane Smith'}]
    }
];

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [showCallPopup, setShowCallPopup] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const handleIncomingCall = (data) => {
      // Automatically accept incoming calls for simplicity in this example
      setActiveCall({
        to: data.from,
        from: chatService.getCurrentUser().id,
        type: 'incoming',
        callType: data.callType,
        offer: data.offer
      });
    };

    chatService.on('signaling-message', (message) => {
        if(message.type === 'call-offer'){
            handleIncomingCall(message)
        }
    });

    return () => {
      chatService.off('signaling-message');
    };
  }, []);

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleStartCall = (callType) => {
    setShowCallPopup(false);
    setActiveCall({
      to: selectedConversation.participants[0].id,
      from: chatService.getCurrentUser().id,
      type: 'outgoing',
      callType,
    });
  };

  const handleHangUp = () => {
    setActiveCall(null);
  };

  if (isMobile) {
    return (
      <Grid container style={{ height: '100vh' }}>
        {!selectedConversation ? (
          <ConversationList
            conversations={mockConversations}
            selectedConversation={selectedConversation}
            onConversationSelect={handleConversationSelect}
          />
        ) : (
          <ChatWindow
            conversation={selectedConversation}
            onStartCall={() => setShowCallPopup(true)}
          />
        )}
        {showCallPopup && <CallPopup open={showCallPopup} onClose={() => setShowCallPopup(false)} onStartCall={handleStartCall} user={selectedConversation.participants[0]}/>}
        {activeCall && <CallWindow activeCall={activeCall} onHangUp={handleHangUp} />}
      </Grid>
    );
  }

  return (
    <Grid container style={{ height: 'calc(100vh - 64px)' }}>
      <Grid item sm={4} md={3} style={{ height: '100%' }}>
        <ConversationList
          conversations={mockConversations}
          selectedConversation={selectedConversation}
          onConversationSelect={handleConversationSelect}
        />
      </Grid>
      <Grid item sm={8} md={9} style={{ height: '100%' }}>
        {selectedConversation ? (
          <ChatWindow conversation={selectedConversation} onStartCall={() => setShowCallPopup(true)}/>
        ) : (
          <AIChat />
        )}
      </Grid>
      {showCallPopup && <CallPopup open={showCallPopup} onClose={() => setShowCallPopup(false)} onStartCall={handleStartCall} user={selectedConversation.participants[0]}/>}
      {activeCall && <CallWindow activeCall={activeCall} onHangUp={handleHangUp} />}
    </Grid>
  );
};

export default MessagesPage;
