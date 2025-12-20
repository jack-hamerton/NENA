
import React from 'react';
import styled from 'styled-components';
import Message from './Message';

const MessageListContainer = styled.div`
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const MessageList = ({ messages, e2eeManager, sessionId }) => {

  // Filter out system/signaling messages so they don't appear in the chat UI
  const visibleMessages = messages.filter(msg => {
    // Backwards compatibility for old format
    if (!msg.type && !msg.text) return true;
    // New format: only show chat messages
    return msg.type !== 'system'; 
  });

  return (
    <MessageListContainer>
      {visibleMessages.map((msg, index) => (
        <Message 
          key={index} 
          message={msg} 
          e2eeManager={e2eeManager} 
          sessionId={sessionId}
        />
      ))}
    </MessageListContainer>
  );
};

export default MessageList;
