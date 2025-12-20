import React, { useState } from 'react';
import styled from 'styled-components';
import ConversationList from '../messages/ConversationList';
import ChatWindow from '../messages/ChatWindow';
import CallWindow from '../messages/CallWindow';
import useCall from '../hooks/useCall';

const MessagesContainer = styled.div`
  display: flex;
  height: calc(100vh - 60px); // Adjust based on your header height
  background-color: #f0f2f5;
`;

// IncomingCall component defined within MessagesPage.jsx
const IncomingCallContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: #333;
  color: white;
  padding: 1rem;
  border-radius: 10px;
  z-index: 110;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
`;

const CallerInfo = styled.div`
  margin-right: 1rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;

  button {
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    cursor: pointer;
  }

  .accept {
    background: #4caf50;
    color: white;
  }

  .reject {
    background: #f44336;
    color: white;
  }
`;

const IncomingCall = ({ call, onAccept, onReject }) => {
  return (
    <IncomingCallContainer>
      <CallerInfo>
        <div>{call.user.name} is calling...</div>
      </CallerInfo>
      <Actions>
        <button className="accept" onClick={onAccept}>✓</button>
        <button className="reject" onClick={onReject}>×</button>
      </Actions>
    </IncomingCallContainer>
  );
};

const mockConversations = [
  { id: 1, name: 'John Doe', lastMessage: 'See you tomorrow!', timestamp: '10:30 AM', unread: 2, online: true, avatar: 'https://i.pravatar.cc/150?u=johndoe' },
  { id: 2, name: 'Jane Smith', lastMessage: 'Okay, sounds good.', timestamp: 'Yesterday', unread: 0, online: false, avatar: 'https://i.pravatar.cc/150?u=janesmith' },
];

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const { 
    call, 
    incomingCall, 
    startCall, 
    endCall, 
    acceptCall, 
    rejectCall, 
    myVideo, 
    userVideo,
    isMuted,
    toggleMute,
    isCameraOff,
    toggleCamera,
    callTimer,
    isScreenSharing,
    toggleScreenSharing,
    isRemoteMuted
  } = useCall();

  const handleStartCall = (type) => {
    startCall(type, selectedConversation);
  };

  return (
    <MessagesContainer>
      <ConversationList
        conversations={mockConversations}
        selectedConversation={selectedConversation}
        onConversationSelect={setSelectedConversation}
      />
      <ChatWindow 
        conversation={selectedConversation} 
        onStartCall={handleStartCall} 
      />
      {incomingCall && <IncomingCall call={incomingCall} onAccept={acceptCall} onReject={rejectCall} />}
      {call && 
        <CallWindow 
          call={call} 
          onEndCall={endCall} 
          myVideo={myVideo} 
          userVideo={userVideo}
          isMuted={isMuted}
          toggleMute={toggleMute}
          isCameraOff={isCameraOff}
          toggleCamera={toggleCamera}
          callTimer={callTimer}
          isScreenSharing={isScreenSharing}
          toggleScreenSharing={toggleScreenSharing}
          isRemoteMuted={isRemoteMuted}
        />
      }
    </MessagesContainer>
  );
};

export default MessagesPage;
