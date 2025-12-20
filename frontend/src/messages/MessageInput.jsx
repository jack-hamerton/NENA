import React from 'react';
import styled from 'styled-components';

const MessageInputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid #ddd;
  background-color: #f5f5f5;
`;

const Input = styled.input`
  flex-grow: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 0.8rem;
  font-size: 1rem;
`;

const SendButton = styled.button`
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-left: 1rem;
  cursor: pointer;
  font-size: 1.2rem;
`;

const AttachmentButton = styled.label`
  background-color: #eee;
  color: #333;
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
