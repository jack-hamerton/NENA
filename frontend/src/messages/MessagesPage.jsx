import { useState, useEffect, useContext } from 'react';
import { Box, Grid, useMediaQuery } from '@mui/material';
import { ThemeProvider } from 'styled-components';
import { theme as appTheme } from '../theme/theme';
import ConversationList from './ConversationList';
import Chat from './Chat';
import { AuthContext } from '../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const isMobile = useMediaQuery('(max-width:600px)');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const mockConversations = [
      {
        id: '1',
        participants: [
          { id: user.id, name: user.username, avatar: 'https://i.pravatar.cc/150?u=me' },
          { id: '2', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=john' }
        ],
        messages: [
          { id: 'm1', senderId: '2', content: 'Hey, how are you?' },
          { id: 'm2', senderId: user.id, content: 'I am good, thanks! How about you?' }
        ],
        unread: 0,
        timestamp: '10:30 AM'
      },
      {
        id: '2',
        participants: [
          { id: user.id, name: user.username, avatar: 'https://i.pravatar.cc/150?u=me' },
          { id: '3', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=jane' }
        ],
        messages: [
          { id: 'm3', senderId: '3', content: 'Let\'s catch up later.' }
        ],
        unread: 1,
        timestamp: 'Yesterday'
      }
    ];
    const processedConversations = mockConversations.map(c => ({
        ...c,
        lastMessage: c.messages[c.messages.length - 1].content
    }));
    setConversations(processedConversations);
  }, [user.id, user.username]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversationId(conversation.id);
  };
  
  const handleBackToConversationList = () => {
      setSelectedConversationId(null);
  }

  const handleCreateConversation = (recipient, initialMessage) => {
    const existingConversation = conversations.find(c => 
        c.participants.some(p => p.id === recipient.id)
    );

    if (existingConversation) {
        handleSendMessage(existingConversation.id, initialMessage);
        setSelectedConversationId(existingConversation.id);
    } else {
        const newConversation = {
            id: uuidv4(),
            participants: [
                { id: user.id, name: user.username, avatar: 'https://i.pravatar.cc/150?u=me' },
                recipient
            ],
            messages: [
                { id: uuidv4(), senderId: user.id, content: initialMessage }
            ],
            unread: 0,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            lastMessage: initialMessage
        };
        
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversationId(newConversation.id);
    }
  };

  const handleSendMessage = (conversationId, messageContent) => {
    setConversations(prev => 
        prev.map(c => {
            if (c.id === conversationId) {
                const newMessage = { id: uuidv4(), senderId: user.id, content: messageContent };
                return {
                    ...c,
                    messages: [...c.messages, newMessage],
                    lastMessage: messageContent,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
            }
            return c;
        })
    );
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const chatView = (
    <Chat 
        conversation={selectedConversation} 
        currentUserId={user.id}
        onSendMessage={handleSendMessage} 
        theme={appTheme}
        isMobile={isMobile}
        onBack={handleBackToConversationList} 
    />
  );

  const conversationListView = (
    <ConversationList 
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={handleSelectConversation}
        onCreateConversation={handleCreateConversation}
        currentUserId={user.id}
        theme={appTheme}
    />
  );

  if (isMobile) {
    return (
      <ThemeProvider theme={appTheme}>
        <Box sx={{ height: 'calc(100vh - 120px)' }}>
          {selectedConversationId === null ? conversationListView : chatView}
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={appTheme}>
      <Grid container sx={{ height: 'calc(100vh - 120px)' }}>
        <Grid item xs={12} sm={5} md={4}>
          {conversationListView}
        </Grid>
        <Grid item xs={12} sm={7} md={8}>
          {chatView}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default MessagesPage;
