import React from 'react';
import styled from 'styled-components';
import CallButton from './CallButton';

const ChatHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #ddd;
  background-color: #f7f7f7;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 1rem;
`;

const ConversationInfo = styled.div`
  flex-grow: 1;
`;

const Name = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;

const Status = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: ${props => props.online ? '#4caf50' : '#888'};
`;

const ChatHeader = ({ conversation, onStartCall }) => {
  return (
    <ChatHeaderContainer>
      <Avatar src={conversation.avatar} alt={conversation.name} />
      <ConversationInfo>
        <Name>{conversation.name}</Name>
        <Status online={conversation.online}>{conversation.online ? 'Online' : 'Offline'}</Status>
      </ConversationInfo>
      <CallButton onStartCall={onStartCall} />
    </ChatHeaderContainer>
  );
};

export default ChatHeader;
