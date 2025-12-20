
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { chatService, Message } from '../services/chatService'; // Assuming chatService is exported from here

const ChatWindowContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ChatWindow = ({ conversation }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!conversation) return;

    // Set initial messages
    chatService.getMessages(conversation.id).then(setMessages);

    // Subscribe to new messages
    const handleNewMessage = (message: Message) => {
      // Assuming the service only gives us messages for the current room
      setMessages(prevMessages => [...prevMessages, message]);
    };

    chatService.onNewMessage(handleNewMessage);

    // Cleanup subscription on component unmount or conversation change
    return () => {
      chatService.offNewMessage();
    };
  }, [conversation]);

  const handleSendMessage = (text: string) => {
    if (!conversation || !text.trim()) return;

    const messageData = {
      text,
      sender: { id: 'me', name: 'Me' }, // This would be the current user
    };

    chatService.sendMessage(messageData).then(sentMessage => {
      // The service now returns the message with the plaintext for local display
      setMessages(prevMessages => [...prevMessages, sentMessage]);
    });
  };

  if (!conversation) {
    return <ChatWindowContainer>Select a conversation to start chatting.</ChatWindowContainer>;
  }

  return (
    <ChatWindowContainer>
      <ChatHeader conversation={conversation} />
      <MessageList messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </ChatWindowContainer>
  );
};

export default ChatWindow;
