
import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import ConversationList from '../messages/ConversationList';
import ChatWindow from '../messages/ChatWindow';
import CallPopup from '../components/call/CallPopup';
import CallWindow from '../components/call/CallWindow';
import { chatService } from '../services/chatService.js';
import { ThemeProvider } from 'styled-components';
import { theme as appTheme } from '../theme/theme'; 

const mockConversations = [
    {
      id: 1,
      users: [
        { id: 'user1', username: 'Alice', avatar: 'https://i.pravatar.cc/150?u=me' },
        { id: 'user2', username: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=johndoe' }
      ],
      lastMessage: { text: 'See you tomorrow!', createdAt: new Date().toISOString() },
      unread: 2,
      online: true,
    },
    {
        id: 2,
        users: [
          { id: 'user1', username: 'Alice', avatar: 'https://i.pravatar.cc/150?u=me' },
          { id: 'user3', username: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=janesmith' }
        ],
        lastMessage: { text: 'Just finished the report.', createdAt: new Date(Date.now() - 86400000).toISOString() },
        unread: 0,
        online: false,
    }
];

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showCallPopup, setShowCallPopup] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const isMobile = window.innerWidth <= 600;

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
      <ThemeProvider theme={appTheme}>
        <Grid container style={{ height: '100vh' }}>
          {!selectedConversation ? (
            <ConversationList
              conversations={mockConversations}
              selectedConversation={selectedConversation}
              onConversationSelect={handleConversationSelect}
              onCreateConversation={(recipient, message) => {
                // Handle creating new conversation
                console.log('Create conversation with:', recipient, message);
              }}
              currentUserId={'user1'}
            />
          ) : (
            <ChatWindow
              conversation={selectedConversation}
              messages={selectedConversation ? selectedConversation.messages || [] : []}
              users={selectedConversation ? selectedConversation.users || [] : []}
              loading={false}
              error={null}
              onSendMessage={(message) => {
                // Handle sending message - this would normally call chatService
                console.log('Send message:', message);
              }}
              currentUser={{ id: 'user1', name: 'Alice' }}
              onStartCall={() => setShowCallPopup(true)}
            />
          )}
          {showCallPopup && selectedConversation && <CallPopup open={showCallPopup} onClose={() => setShowCallPopup(false)} onStartCall={handleStartCall} user={selectedConversation.users.find(u => u.id !== 'user1')}/>}
          {activeCall && <CallWindow activeCall={activeCall} onHangUp={handleHangUp} />}
        </Grid>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={appTheme}>
      <Grid container style={{ height: 'calc(100vh - 64px)' }}>
        <Grid item sm={4} md={3} style={{ height: '100%' }}>
          <ConversationList
            conversations={mockConversations}
            selectedConversation={selectedConversation}
            onConversationSelect={handleConversationSelect}
            onCreateConversation={(recipient, message) => {
              // Handle creating new conversation
              console.log('Create conversation with:', recipient, message);
            }}
            currentUserId={'user1'}
          />
        </Grid>
        <Grid item sm={8} md={9} style={{ height: '100%' }}>
          {selectedConversation ? (
            <ChatWindow
              conversation={selectedConversation}
              messages={selectedConversation ? selectedConversation.messages || [] : []}
              users={selectedConversation ? selectedConversation.users || [] : []}
              loading={false}
              error={null}
              onSendMessage={(message) => {
                // Handle sending message - this would normally call chatService
                console.log('Send message:', message);
              }}
              currentUser={{ id: 'user1', name: 'Alice' }}
              onStartCall={() => setShowCallPopup(true)}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#fff' }}>
              <h2>Select a conversation to start messaging</h2>
            </div>
          )}
        </Grid>
        {showCallPopup && selectedConversation && <CallPopup open={showCallPopup} onClose={() => setShowCallPopup(false)} onStartCall={handleStartCall} user={selectedConversation.users.find(u => u.id !== 'user1')}/>}
        {activeCall && <CallWindow activeCall={activeCall} onHangUp={handleHangUp} />}
      </Grid>
    </ThemeProvider>
  );
};

export default MessagesPage;
