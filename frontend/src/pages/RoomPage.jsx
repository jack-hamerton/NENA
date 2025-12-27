import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { RoomVideoGrid } from '../rooms/RoomVideoGrid';
import { Chat } from '../rooms/Chat';
import { Polls } from '../rooms/Polls';
import { Reactions } from '../rooms/Reactions';
import { ControlsBar } from '../rooms/ControlsBar';
import { HostControls } from '../rooms/HostControls';
import { Document } from '../components/collaboration/Document'; // Import Document
import { theme } from '../theme/theme';
import { WebRTCManager } from '../rooms/e2ee/webrtc';

const RoomContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${props => props.theme.palette.dark};
  color: ${props => props.theme.text.primary};
`;

const MainContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const VideoContainer = styled.div`
  flex-grow: 1;
  position: relative;
`;

const Sidebar = styled.div`
  width: 320px;
  flex-shrink: 0;
  background-color: ${props => props.theme.palette.primary};
  border-left: 1px solid ${props => props.theme.palette.dark};
  display: flex;
  flex-direction: column;
`;

const TabContainer = styled.div`
    display: flex;
    border-bottom: 1px solid ${props => props.theme.palette.dark};
`;

const TabButton = styled.button`
    flex: 1;
    padding: 10px;
    border: none;
    background-color: ${props => props.active ? props.theme.palette.accent : 'transparent'};
    color: ${props => props.theme.text.primary};
    cursor: pointer;
    font-size: 16px;

    &:hover {
        background-color: ${props => props.theme.palette.secondary};
    }
`;

// New container to ensure Document component can scroll independently
const SidebarContent = styled.div`
    flex-grow: 1;
    overflow: auto; // Allow scrolling for the content area
`;

const RoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [sidebarTab, setSidebarTab] = useState('chat'); // chat, polls, collaborate
  const [reactions, setReactions] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const webRTCManager = useRef(null);

  const isHost = true; // Mock isHost

  useEffect(() => {
    let localWebRTCManager;
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        webRTCManager.current = new WebRTCManager(
          roomId,
          stream,
          (clientId, stream) => setRemoteStreams(prev => ({ ...prev, [clientId]: stream })),
          (clientId) => setRemoteStreams(prev => {
            const newState = { ...prev };
            delete newState[clientId];
            return newState;
          })
        );
        localWebRTCManager = webRTCManager.current;
      } catch (error) {
        console.error("Error initializing WebRTC manager:", error);
      }
    };

    init();

    return () => {
      if (localWebRTCManager) localWebRTCManager.close();
      if (localStream) localStream.getTracks().forEach(track => track.stop());
    };
  }, [roomId]);

  const handleSendReaction = (emoji) => {
    // Reaction logic remains the same
  };

  const leaveRoom = () => {
    // Leave room logic remains the same
    navigate('/');
  };

  if (!roomId) {
    return <div>Room not found</div>;
  }
  
  // Define the document object for the collaboration component
  const collaborationDocument = {
      id: `room-${roomId}`,
      name: `Shared Notes for Room ${roomId}`,
      content: '' // Initial content would be loaded from a backend
  };

  return (
    <ThemeProvider theme={theme}>
      <RoomContainer>
        <MainContent>
          <VideoContainer>
            <RoomVideoGrid localStream={localStream} remoteStreams={remoteStreams} />
            <Reactions reactions={reactions} />
          </VideoContainer>
          <ControlsBar onSendReaction={handleSendReaction} localStream={localStream} onLeave={leaveRoom} />
          {isHost && <HostControls />}
        </MainContent>
        <Sidebar>
          <TabContainer>
              <TabButton active={sidebarTab === 'chat'} onClick={() => setSidebarTab('chat')}>Chat</TabButton>
              <TabButton active={sidebarTab === 'polls'} onClick={() => setSidebarTab('polls')}>Polls</TabButton>
              <TabButton active={sidebarTab === 'collaborate'} onClick={() => setSidebarTab('collaborate')}>Collaborate</TabButton>
          </TabContainer>

          <SidebarContent>
            {sidebarTab === 'chat' && <Chat roomId={roomId} />}
            {sidebarTab === 'polls' && <Polls roomId={roomId} />}
            {sidebarTab === 'collaborate' && <Document document={collaborationDocument} />}
          </SidebarContent>
          
        </Sidebar>
      </RoomContainer>
    </ThemeProvider>
  );
};

export default RoomPage;
