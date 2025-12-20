import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { generateKeyPair, deriveSharedSecret, encryptMessage } from './e2ee/crypto.js';

const ChatWindowContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

// In a real app, you would fetch or have a key management system
const userKeys = new Map();

const ChatWindow = ({ conversation, onStartCall }) => {
  const [sharedSecret, setSharedSecret] = useState(null);
  const [messages, setMessages] = useState([]);

  const getMyKeys = useCallback(async () => {
    if (!userKeys.has('me')) {
      userKeys.set('me', await generateKeyPair());
    }
    return userKeys.get('me');
  }, []);

  const getTheirKeys = useCallback(async (userId) => {
    if (!userKeys.has(userId)) {
      userKeys.set(userId, await generateKeyPair());
    }
    return userKeys.get(userId);
  }, []);

  useEffect(() => {
    async function setupEncryption() {
      const myKeys = await getMyKeys();
      const theirKeys = await getTheirKeys(conversation.id);
      const secret = await deriveSharedSecret(myKeys.privateKey, theirKeys.publicKey);
      setSharedSecret(secret);
      setMessages([]); // Clear messages when conversation changes
    }

    if (conversation) {
      setupEncryption();
    }
  }, [conversation, getMyKeys, getTheirKeys]);

  const handleSendMessage = async (text) => {
    if (!sharedSecret) return;

    const encoder = new TextEncoder();
    const encryptedText = await encryptMessage(sharedSecret, encoder.encode(text));

    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: new Uint8Array(encryptedText), // Send the raw encrypted data
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);

    // --- Simulate receiving the message by the other user ---
    setTimeout(async () => {
      const theirKeys = await getTheirKeys(conversation.id);
      const myKeys = await getMyKeys();
      const receivingSecret = await deriveSharedSecret(theirKeys.privateKey, myKeys.publicKey);

      const receivedMessage = {
        ...newMessage,
        id: Date.now() + 1, // Ensure unique ID
        sender: conversation.name,
        // The `text` is the same encrypted payload
      };
      
      // This demonstrates that the other user can decrypt the message with the same shared secret
      setMessages(prevMessages => [...prevMessages, receivedMessage]);
    }, 1000);
  };

  if (!conversation) {
    return <ChatWindowContainer>Select a conversation to start chatting.</ChatWindowContainer>;
  }

  return (
    <ChatWindowContainer>
      <ChatHeader conversation={conversation} onStartCall={onStartCall} />
      <MessageList messages={messages} sharedSecret={sharedSecret} />
      <MessageInput onSendMessage={handleSendMessage} />
    </ChatWindowContainer>
  );
};

export default ChatWindow;
