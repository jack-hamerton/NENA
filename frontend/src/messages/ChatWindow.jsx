
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Document } from '../components/collaboration/Document'; // Import Document component
import { chatService } from '../services/chatService';

const ChatWindowContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.palette.primary};
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.palette.dark};
`;

const Tab = styled.button`
  flex: 0.5; // Give equal space to tabs
  padding: 1rem;
  background: none;
  border: none;
  color: ${props => (props.active ? props.theme.text.primary : props.theme.text.secondary)};
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  border-bottom: 2px solid ${props => (props.active ? props.theme.palette.accent : 'transparent')};

  &:hover {
    background-color: ${props => props.theme.palette.dark};
  }
`;

const ContentContainer = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden; // Important for nested scrolling
`;

const ChatWindow = ({ conversation, onStartCall, e2eeManager, sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'collaborate'

  useEffect(() => {
    if (!conversation) return;

    chatService.getMessages(conversation.id).then(setMessages);

    const handleNewMessage = (message) => {
        // In a real app, you'd check if the message belongs to the current conversation
        setMessages(prevMessages => [...prevMessages, message]);
    };

    chatService.onNewMessage(handleNewMessage);

    return () => {
      chatService.offNewMessage(handleNewMessage);
    };
  }, [conversation]);

  const handleSendMessage = (text) => {
    if (!conversation || !text.trim()) return;
    
    // E2EE logic would go here before sending
    // For now, we'll send plaintext for simplicity in this component

    const messageData = {
      text,
      sender: { id: 'me', name: 'Me' },
      conversationId: conversation.id,
    };

    chatService.sendMessage(messageData);
    setMessages(prevMessages => [...prevMessages, messageData]);
  };

  if (!conversation) {
    return <ChatWindowContainer>Select a conversation to start chatting.</ChatWindowContainer>;
  }
  
  // Create a unique document ID for each conversation to isolate collaboration sessions
  const collaborationDocument = {
      id: `conversation-${conversation.id}`,
      name: `Notes for ${conversation.name}`,
      content: '' // Initial content can be loaded from your backend
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
            <MessageList messages={messages} />
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          // The Document component is now rendered here
          <Document document={collaborationDocument} />
        )}
      </ContentContainer>
    </ChatWindowContainer>
  );
};

export default ChatWindow;
