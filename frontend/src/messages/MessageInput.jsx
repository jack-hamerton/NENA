
import React from 'react';
import styled from 'styled-components';

const MessageInputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid ${props => props.theme.palette.highlight};
  background-color: ${props => props.theme.palette.primary};
`;

const Input = styled.input`
  flex-grow: 1;
  border: 1px solid ${props => props.theme.palette.highlight};
  border-radius: 20px;
  padding: 0.8rem;
  font-size: 1rem;
  background-color: ${props => props.theme.palette.secondary};
  color: ${props => props.theme.text.primary};
`;

const SendButton = styled.button`
  background-color: ${props => props.theme.palette.secondary};
  color: ${props => props.theme.text.primary};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-left: 1rem;
  cursor: pointer;
  font-size: 1.2rem;
`;

const AttachmentButton = styled.label`
  background-color: ${props => props.theme.palette.secondary};
  color: ${props => props.theme.text.primary};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-right: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;

  input[type="file"] {
      display: none;
  }
`;

const MessageInput = () => {
  return (
    <MessageInputContainer>
      <AttachmentButton>
        +
        <input type="file" />
      </AttachmentButton>
      <Input type="text" placeholder="Type a message..." />
      <SendButton>➤</SendButton>
    </MessageInputContainer>
  );
};

export default MessageInput;
