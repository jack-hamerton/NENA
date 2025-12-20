
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatWindowContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative; /* For positioning the video call overlay */
`;

const VideoContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #2c3e50;
  display: ${props => props.isActive ? 'flex' : 'none'};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const LocalVideo = styled.video`
  width: 150px;
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  border-radius: 8px;
`;

const RemoteVideo = styled.video`
  width: 70%;
  max-width: 800px;
  border-radius: 8px;
`;

const EndCallButton = styled.button`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.8rem 1.5rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  z-index: 110;
`;


const ChatWindow = ({ conversation, e2eeManager, sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [isCallActive, setIsCallActive] = useState(false);

  const peerConnectionRef = useRef(null);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const localStreamRef = useRef();

  // Unified function to send any message, chat or signal
  const sendSystemMessage = async (payload) => {
    if (!e2eeManager || !sessionId) return;
    try {
      const encryptedPayload = await e2eeManager.encryptMessage(sessionId, JSON.stringify(payload));
      const newMessage = {
        id: Date.now(),
        sender: 'me',
        type: 'system', // Differentiate from user chat messages
        ...encryptedPayload,
      };
      setMessages(prev => [...prev, newMessage]);

      // Simulate network for the other user receiving it
      setTimeout(() => {
        const { text, ...payloadForOtherUser } = newMessage;
        const receivedMessage = {
          ...payloadForOtherUser,
          id: Date.now() + 1,
          sender: conversation.name,
        };
        setMessages(prev => [...prev, receivedMessage]);
      }, 500);
    } catch (error) {
      console.error("Error sending system message:", error);
    }
  };

  const handleSendMessage = async (text) => {
    if (!e2eeManager || !sessionId || !text) return;
    const payload = { type: 'chat', content: text };
    try {
      const encryptedPayload = await e2eeManager.encryptMessage(sessionId, JSON.stringify(payload));
      const newMessage = {
        id: Date.now(),
        sender: 'me',
        text: text, // For immediate display
        ...encryptedPayload
      };
      setMessages(prev => [...prev, newMessage]);

      // Simulate network for the other user receiving it
      setTimeout(() => {
        const { text, ...payloadForOtherUser } = newMessage;
        const receivedMessage = {
          ...payloadForOtherUser,
          id: Date.now() + 1,
          sender: conversation.name,
        };
        setMessages(prev => [...prev, receivedMessage]);
      }, 1000);
    } catch (error) {
      console.error("Error encrypting message:", error);
    }
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

    pc.onicecandidate = event => {
      if (event.candidate) {
        sendSystemMessage({ type: 'signal', content: { type: 'candidate', candidate: event.candidate } });
      }
    };

    pc.ontrack = event => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    localStreamRef.current.getTracks().forEach(track => {
      pc.addTrack(track, localStreamRef.current);
    });

    peerConnectionRef.current = pc;
    return pc;
  };

  const handleStartCall = async () => {
    setIsCallActive(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;
    localStreamRef.current = stream;

    const pc = createPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    sendSystemMessage({ type: 'signal', content: { type: 'offer', offer } });
  };
  
  const handleEndCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    setIsCallActive(false);
    sendSystemMessage({ type: 'signal', content: { type: 'hangup' } });
  };


  // Effect to handle incoming messages (both chat and signals)
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.sender === 'me' || !e2eeManager) return;
    
    const processMessage = async () => {
      try {
        const decryptedText = await e2eeManager.decryptMessage(sessionId, lastMessage.iv, lastMessage.ciphertext);
        const payload = JSON.parse(decryptedText);

        if (payload.type === 'chat') {
          // This part is handled by the Message component now
        } else if (payload.type === 'signal') {
          handleSignalingData(payload.content);
        }
      } catch (error) {
        // Fallback for decryption failure is handled in Message.jsx
        console.error("Failed to decrypt or process incoming message:", error);
      }
    };
    processMessage();

    const handleSignalingData = async (data) => {
      let pc = peerConnectionRef.current;
      
      if (data.type === 'offer') {
        // Answer a call
        setIsCallActive(true);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = stream;
        localStreamRef.current = stream;

        pc = createPeerConnection();
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendSystemMessage({ type: 'signal', content: { type: 'answer', answer } });

      } else if (data.type === 'answer') {
        if (pc) await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      } else if (data.type === 'candidate') {
        if (pc) await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      } else if (data.type === 'hangup') {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
        setIsCallActive(false);
      }
    };
  }, [messages, e2eeManager, sessionId]);
  
  // Cleanup on conversation change
  useEffect(() => {
    handleEndCall();
    setMessages([]);
  }, [conversation]);


  if (!conversation) {
    return <ChatWindowContainer>Select a conversation to start chatting.</ChatWindowContainer>;
  }

  return (
    <ChatWindowContainer>
      <ChatHeader 
        conversation={conversation} 
        onStartCall={handleStartCall} 
        sessionId={sessionId}
      />
      <VideoContainer isActive={isCallActive}>
        <RemoteVideo ref={remoteVideoRef} autoPlay />
        <LocalVideo ref={localVideoRef} autoPlay muted />
        <EndCallButton onClick={handleEndCall}>End Call</EndCallButton>
      </VideoContainer>
      <MessageList 
        messages={messages} 
        e2eeManager={e2eeManager} 
        sessionId={sessionId} 
      />
      <MessageInput onSendMessage={handleSendMessage} />
    </ChatWindowContainer>
  );
};

export default ChatWindow;
