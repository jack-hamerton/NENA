import React from 'react';
import styled from 'styled-components';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatWindowContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ChatWindow = ({ conversation, onStartCall }) => {
  if (!conversation) {
    return <ChatWindowContainer>Select a conversation to start chatting.</ChatWindowContainer>;
  }

  return (
    <ChatWindowContainer>
      <ChatHeader conversation={conversation} onStartCall={onStartCall} />
      <MessageList />
      <MessageInput />
    </ChatWindowContainer>
  );
};

export default ChatWindow;
