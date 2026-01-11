
import React, { useState, useEffect, useMemo } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import ConversationList from '../messages/ConversationList';
import ChatWindow from '../messages/ChatWindow';
import CallWindow from '../components/call/CallWindow';
import CallPopup from '../components/call/CallPopup';
import useCall from '../hooks/useCall';
import { KeyStore } from '../messages/e2ee/keystore';
import { E2EEManager } from '../messages/e2ee/e2eeManager';
import { theme } from '../theme/theme';
import { webRTCService } from '../services/webRTCService';

const MessagesContainer = styled.div`
  display: flex;
  height: calc(100vh - 60px); // Adjust based on your header height
  background-color: ${props => props.theme.palette.primary};
`;

// Omitted IncomingCall component for brevity

const mockConversations = [
  { id: 1, name: 'John Doe', lastMessage: 'See you tomorrow!', timestamp: '10:30 AM', unread: 2, online: true, avatar: 'https://i.pravatar.cc/150?u=johndoe' },
  { id: 2, name: 'Jane Smith', lastMessage: 'Okay, sounds good.', timestamp: 'Yesterday', unread: 0, online: false, avatar: 'https://i.pravatar.cc/150?u=janesmith' },
];

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [activeCall, setActiveCall] = useState(null);
  const [showCallPopup, setShowCallPopup] = useState(false);
  
  // E2EE State
  const [e2eeManager, setE2eeManager] = useState(null);
  const [sessionMap, setSessionMap] = useState(new Map());

  const { 
    call, incomingCall, startCall, endCall, acceptCall, rejectCall, 
    myVideo, userVideo, isMuted, toggleMute, isCameraOff, toggleCamera, 
    callTimer, isScreenSharing, toggleScreenSharing, isRemoteMuted
  } = useCall();

  // Initialize E2EE Manager
  useEffect(() => {
    const keyStore = new KeyStore();
    const manager = new E2EEManager(keyStore);
    setE2eeManager(manager);
  }, []);

  // Establish session when conversation changes
  useEffect(() => {
    const establishSession = async () => {
      if (!e2eeManager || !selectedConversation || sessionMap.has(selectedConversation.id)) {
        return;
      }

      console.log(`Establishing E2EE session for conversation: ${selectedConversation.id}`);
      
      // In a real app, you would fetch the recipient's public keys from a server.
      // For this simulation, we generate them on the fly.
      // This simulates the recipient having their own KeyStore.
      const recipientKeyStore = new KeyStore();
      await recipientKeyStore.loadIdentityKey();
      const recipientIdentityKey = recipientKeyStore.identityKey.publicKey;
      const recipientPreKeyBundle = await recipientKeyStore.getSignedPublicPreKey(1);


      const newSessionId = await e2eeManager.establishSession(
        selectedConversation.id,
        recipientIdentityKey,
        recipientPreKeyBundle
      );

      setSessionMap(prevMap => new Map(prevMap).set(selectedConversation.id, newSessionId));
    };

    establishSession();
  }, [selectedConversation, e2eeManager, sessionMap]);

  const handleStartCall = (type) => {
    const callData = {
      to: selectedConversation.id,
      type: 'outgoing',
      callType: type
    };
    setActiveCall(callData);
    setShowCallPopup(false);
  };

  const handleHangUp = () => {
    setActiveCall(null);
  };

  const activeSessionId = useMemo(() => {
    if (!selectedConversation) return null;
    return sessionMap.get(selectedConversation.id);
  }, [selectedConversation, sessionMap]);

  return (
    <ThemeProvider theme={theme}>
      <MessagesContainer>
        <ConversationList
          conversations={mockConversations}
          selectedConversation={selectedConversation}
          onConversationSelect={setSelectedConversation}
        />
        <ChatWindow 
          conversation={selectedConversation} 
          onStartCall={() => setShowCallPopup(true)}
          e2eeManager={e2eeManager}
          sessionId={activeSessionId}
        />
        {showCallPopup && 
          <CallPopup 
            user={selectedConversation} 
            onStartCall={handleStartCall} 
            onClose={() => setShowCallPopup(false)} 
          />
        }
        {activeCall && 
          <CallWindow 
            call={activeCall} 
            onHangUp={handleHangUp} 
          />
        }
      </MessagesContainer>
    </ThemeProvider>
  );
};

export default MessagesPage;
