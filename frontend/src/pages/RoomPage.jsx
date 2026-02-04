
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { RoomVideoGrid } from '../rooms/RoomVideoGrid';
import { Chat } from '../rooms/Chat';
import { Polls } from '../rooms/Polls';
import { Reactions } from '../rooms/Reactions';
import { ControlsBar } from '../rooms/ControlsBar';
import { HostControls } from '../rooms/HostControls';
import { Document } from '../components/collaboration/Document';
import { theme } from '../theme/theme';
import { WebRTCManager } from '../rooms/e2ee/webrtc';
import {
  RoomContainer,
  MainContent,
  VideoContainer,
  Sidebar,
  TabContainer,
  TabButton,
  SidebarContent,
  ToggleSidebarButton,
} from './RoomPage.styled';

const RoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [sidebarTab, setSidebarTab] = useState('chat'); // chat, polls, collaborate
  const [isSidebarOpen, setSidebarOpen] = useState(false);
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
    navigate('/home');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  if (!roomId) {
    return <div>Room not found</div>;
  }
  
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
        <Sidebar className={isSidebarOpen ? 'open' : ''}>
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
        <ToggleSidebarButton onClick={toggleSidebar}>
          {isSidebarOpen ? 'Close' : 'Open'}
        </ToggleSidebarButton>
      </RoomContainer>
    </ThemeProvider>
  );
};

export default RoomPage;
