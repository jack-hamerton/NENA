
import React from 'react';
import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.palette.highlight};
  background-color: ${props => props.theme.palette.primary};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 1rem;
`;

const CallButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.palette.secondary};
  color: ${props => props.theme.text.primary};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
  }
`;

const ChatHeader = ({ conversation, onStartCall, sessionId }) => {
  return (
    <Header>
      <UserInfo>
        <Avatar src={conversation.avatar} alt={conversation.name} />
        <h3>{conversation.name}</h3>
      </UserInfo>
      <CallButton onClick={onStartCall} disabled={!sessionId}>
        Start Call
      </CallButton>
    </Header>
  );
};

export default ChatHeader;
