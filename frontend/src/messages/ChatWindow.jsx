
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Box, CircularProgress, Typography } from '@mui/material';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Document } from '../components/collaboration/Document';
import { chatService } from '../services/chatService.js';

const ChatWindowContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.palette.background.default};
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.palette.divider};
`;

const Tab = styled.button`
  flex: 0.5;
  padding: 1rem;
  background: none;
  border: none;
  color: ${props => (props.active ? props.theme.palette.text.primary : props.theme.palette.text.secondary)};
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  border-bottom: 2px solid ${props => (props.active ? props.theme.palette.primary.main : 'transparent')};

  &:hover {
    background-color: ${props => props.theme.palette.action.hover};
  }
`;

const ContentContainer = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const NoConversationSelected = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: ${props => props.theme.palette.text.secondary};
`;

const ChatWindow = ({ conversation, messages: initialMessages, users, loading, error, onSendMessage, currentUser, onStartCall }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState(initialMessages || []);

  useEffect(() => {
    setMessages(initialMessages || []);
  }, [initialMessages]);

  useEffect(() => {
    const handleMessageDeleted = ({ messageId }) => {
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
    };

    chatService.on('message-deleted', handleMessageDeleted);

    return () => {
      chatService.off('message-deleted', handleMessageDeleted);
    };
  }, []);

  if (!conversation) {
    return (
        <ChatWindowContainer>
            <NoConversationSelected>
                <Typography>Select a conversation to start chatting.</Typography>
            </NoConversationSelected>
        </ChatWindowContainer>
    );
  }
  
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>{error}</Typography>;
  }

  const collaborationDocument = {
      id: `conversation-${conversation.id}`,
      name: `Notes for ${conversation.name}`,
      content: ''
  };

  return (
    <ChatWindowContainer>
      <ChatHeader conversation={conversation} onStartCall={onStartCall} />
      <Tabs>
        <Tab active={activeTab === 'chat'} onClick={() => setActiveTab('chat')}>
          Chat
        </Tab>
        <Tab active={activeTab === 'collaborate'} onClick={() => setActiveTab('collaborate')}>
          Collaborate
        </Tab>
      </Tabs>
      <ContentContainer>
        {activeTab === 'chat' ? (
          <>
            <MessageList messages={messages} users={users} currentUserId={currentUser.id} />
            <MessageInput onSendMessage={onSendMessage} />
          </>
        ) : (
          <Document document={collaborationDocument} />
        )}
      </ContentContainer>
    </ChatWindowContainer>
  );
};

export default ChatWindow;
