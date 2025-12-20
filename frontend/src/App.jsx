
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import ChatWindow from './messages/ChatWindow';
import { KeyStore } from './messages/e2ee/keystore';
import { E2EEManager } from './messages/e2ee/e2eeManager';
import { DataEncryptor } from './messages/e2ee/DataEncryptor';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
`;

const App = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  
  const [keyStore, setKeyStore] = useState(null);
  const [e2eeManager, setE2eeManager] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  // Initialize KeyStore and DataEncryptor
  useEffect(() => {
    const initCrypto = async () => {
      const store = new KeyStore();
      await store.init();
      setKeyStore(store);

      const dataEncryptor = new DataEncryptor(store);

      // 1. RAW DATA: This is what we want to store securely.
      const rawConversationData = [
        { id: 1, name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice' },
        { id: 2, name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob' },
        { id: 3, name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=charlie' },
      ];

      // 2. ENCRYPTED BLOB: This is what is stored on your server. It is zero-knowledge.
      const encryptedDataBlob = await dataEncryptor.encryptForServer(rawConversationData);
      console.log("This is what your server would store:", encryptedDataBlob);

      // 3. DECRYPTION ON CLIENT: The app fetches the blob and decrypts it locally.
      try {
        const decryptedData = await dataEncryptor.decryptFromServer(encryptedDataBlob);
        setConversations(decryptedData);
        console.log("Decrypted conversation data on the client:", decryptedData);
      } catch (error) {
        console.error("Failed to decrypt server data:", error);
        // Handle error - maybe show a global error message
      }
    };
    
    initCrypto();
  }, []);

  const handleSelectConversation = async (conversation) => {
    setCurrentConversation(conversation);
    setSessionId(null); 
    setE2eeManager(null);

    if (keyStore) {
      console.log("Establishing E2EE session for the chat...");
      const manager = new E2EEManager(keyStore);
      
      const recipientKeyStore = new KeyStore();
      await recipientKeyStore.init();
      const recipientIdentityKey = await recipientKeyStore.getIdentityKey();
      const recipientPreKey = await recipientKeyStore.getPreKey();

      const id = await manager.establishSession(
        conversation.id,
        recipientIdentityKey,
        recipientPreKey
      );
      
      setE2eeManager(manager);
      setSessionId(id);
      console.log(`E2EE session established with ID: ${id}`);
    }
  };

  return (
    <AppContainer>
      <Sidebar conversations={conversations} onSelectConversation={handleSelectConversation} />
      <ChatWindow
        conversation={currentConversation}
        e2eeManager={e2eeManager}
        sessionId={sessionId}
      />
    </AppContainer>
  );
};

export default App;
