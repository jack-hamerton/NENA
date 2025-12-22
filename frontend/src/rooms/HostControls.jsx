
import React, { useState } from 'react';
import styled from 'styled-components';
import { callService } from '../services/callService';

const HostControlsContainer = styled.div`
  padding: 10px;
  background-color: ${props => props.theme.palette.primary};
  border-bottom: 1px solid ${props => props.theme.palette.highlight};
`;

const HostControlsTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 10px;
  color: ${props => props.theme.text.primary};
`;

const HostControlButton = styled.button`
  display: block;
  width: 100%;
  margin-bottom: 5px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: ${props => props.theme.palette.secondary};
  color: ${props => props.theme.text.primary};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${props => props.theme.palette.highlight};
  }
`;

export const HostControls: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const handleMuteToggle = () => {
    callService.toggleMute();
    setIsMuted(!isMuted);
  };

  const handleScreenShareToggle = () => {
    callService.toggleScreenShare();
    setIsScreenSharing(!isScreenSharing);
  };

  return (
    <HostControlsContainer>
      <HostControlsTitle>Host Controls</HostControlsTitle>
      <HostControlButton onClick={handleMuteToggle}>{isMuted ? 'Unmute' : 'Mute'}</HostControlButton>
      <HostControlButton onClick={handleScreenShareToggle}>{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</HostControlButton>
      <HostControlButton>Mute All</HostControlButton>
      <HostControlButton>Stop All Videos</HostControlButton>
      <HostControlButton>Lock Meeting</HostControlButton>
      <HostControlButton>Waiting Room</HostControlButton>
    </HostControlsContainer>
  );
};
