import React from 'react';
import styled from 'styled-components';

const ConversationListContainer = styled.div`
  width: 320px;
  flex-shrink: 0;
  border-right: 1px solid #ddd;
  overflow-y: auto;
`;

const ConversationItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  background-color: ${props => props.active ? '#eee' : 'transparent'};

  &:hover {
    background-color: #f5f5f5;
  }
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
`;

const ConversationInfo = styled.div`
  flex-grow: 1;
`;

const ConversationName = styled.h4`
  margin: 0;
`;

const LastMessage = styled.p`
  margin: 0;
  color: #888;
`;

const Timestamp = styled.span`
  font-size: 0.8rem;
  color: #888;
`;

const UnreadBadge = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #1a73e8;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
`;

const ConversationList = ({ conversations, selectedConversation, onConversationSelect }) => {
  return (
    <ConversationListContainer>
      {conversations.map(convo => (
        <ConversationItem key={convo.id} active={selectedConversation.id === convo.id} onClick={() => onConversationSelect(convo)}>
          <Avatar src={convo.avatar} alt={convo.name} />
          <ConversationInfo>
            <ConversationName>{convo.name}</ConversationName>
            <LastMessage>{convo.lastMessage}</LastMessage>
          </ConversationInfo>
          <div>
            <Timestamp>{convo.timestamp}</Timestamp>
            {convo.unread > 0 && <UnreadBadge>{convo.unread}</UnreadBadge>}
          </div>
        </ConversationItem>
      ))}
    </ConversationListContainer>
  );
};

export default ConversationList;
