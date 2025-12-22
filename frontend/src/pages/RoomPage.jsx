import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { RoomVideoGrid } from '../rooms/RoomVideoGrid';
import { Chat } from '../rooms/Chat';
import { Polls } from '../rooms/Polls';
import { Reactions } from '../rooms/Reactions';
import { ControlsBar } from '../rooms/ControlsBar';
import { HostControls } from '../rooms/HostControls';
import { theme } from '../theme/theme';

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

const RoomPage = () => {
  const { roomId } = useParams();
  const [sidebarTab, setSidebarTab] = useState('chat'); // chat, polls

  // Mock participants for now
  const participants = [
    { id: '1', name: 'User 1', isAudioMuted: false, isVideoMuted: false },
    { id: '2', name: 'User 2', isAudioMuted: true, isVideoMuted: false },
    { id: '3', name: 'User 3', isAudioMuted: false, isVideoMuted: true },
  ];

  // Mock isHost
  const isHost = true;

  if (!roomId) {
    return <div>Room not found</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <RoomContainer>
        <MainContent>
          <VideoContainer>
            <RoomVideoGrid participants={participants} />
            <Reactions />
          </VideoContainer>
          <ControlsBar />
          {isHost && <HostControls />}
        </MainContent>
        <Sidebar>
          <TabContainer>
              <TabButton active={sidebarTab === 'chat'} onClick={() => setSidebarTab('chat')}>Chat</TabButton>
              <TabButton active={sidebarTab === 'polls'} onClick={() => setSidebarTab('polls')}>Polls</TabButton>
          </TabContainer>

          {sidebarTab === 'chat' && <Chat roomId={roomId} />}
          {sidebarTab === 'polls' && <Polls roomId={roomId} />}
        </Sidebar>
      </RoomContainer>
    </ThemeProvider>
  );
};

export default RoomPage;
