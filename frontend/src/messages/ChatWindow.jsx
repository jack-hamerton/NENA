
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Document } from '../components/collaboration/Document';
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
  flex: 0.5;
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
    overflow: hidden;
`;

const ChatWindow = ({ conversation, onStartCall }) => {
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('chat');
  const userId = 'user123'; // This would be dynamically set in a real app

  useEffect(() => {
    if (!conversation) return;

    // Connect to the chat service
    chatService.connect(userId);

    const handleNewMessage = (message) => {
      if (message.conversationId === conversation.id) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    };

    const handleNewFile = (fileMessage) => {
      if (fileMessage.conversationId === conversation.id) {
        // For now, we'll just display a message with the file name
        const fileInfo = {
          ...fileMessage,
          text: `File received: ${fileMessage.fileName}`,
        };
        setMessages(prevMessages => [...prevMessages, fileInfo]);
      }
    };

    chatService.on('new-message', handleNewMessage);
    chatService.on('new-file', handleNewFile);

    // Fetch initial messages (optional, if you have message history)
    // chatService.getMessages(conversation.id).then(setMessages);

    return () => {
      chatService.off('new-message', handleNewMessage);
      chatService.off('new-file', handleNewFile);
    };
  }, [conversation, userId]);

  const handleSendMessage = (textOrFile) => {
    if (!conversation) return;

    if (typeof textOrFile === 'string') {
      chatService.sendMessage({
        text: textOrFile,
        conversationId: conversation.id,
        recipientId: conversation.id, // Assuming conversation ID is the recipient ID
      });
    } else {
      chatService.sendFile({
        file: textOrFile,
        conversationId: conversation.id,
        recipientId: conversation.id,
      });
    }
  };
  
  const handleStartCall = () => {
    if (!conversation) return;
    chatService.startCall(conversation.id);
    onStartCall(); // Notify the parent component to show the call window
  };

  if (!conversation) {
    return <ChatWindowContainer>Select a conversation to start chatting.</ChatWindowContainer>;
  }

  const collaborationDocument = {
      id: `conversation-${conversation.id}`,
      name: `Notes for ${conversation.name}`,
      content: ''
  };

  return (
    <ChatWindowContainer>
      <ChatHeader conversation={conversation} onStartCall={handleStartCall} />
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
          <Document document={collaborationDocument} />
        )}
      </ContentContainer>
    </ChatWindowContainer>
  );
};

export default ChatWindow;
