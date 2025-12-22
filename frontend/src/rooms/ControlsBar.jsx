import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { VirtualBackground } from './VirtualBackground';
import { ReactionPanel } from './ReactionPanel';

const ControlsBarContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
  background-color: ${props => props.theme.palette.primary};
`;

const ControlButton = styled.button`
  margin: 0 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: ${props => props.theme.palette.secondary};
  color: ${props => props.theme.text.primary};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${props => props.theme.palette.highlight};
  }

  &.end-call {
    background-color: #f44336;
  }
`;

export const ControlsBar = ({ onSendReaction, localStream, onLeave }) => {
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [showVirtualBackground, setShowVirtualBackground] = useState(false);
  const [showReactionPanel, setShowReactionPanel] = useState(false);

  useEffect(() => {
    if (localStream) {
      if (localStream.getAudioTracks().length > 0) {
        localStream.getAudioTracks()[0].enabled = !isAudioMuted;
      }
      if (localStream.getVideoTracks().length > 0) {
        localStream.getVideoTracks()[0].enabled = !isVideoMuted;
      }
    }
  }, [localStream, isAudioMuted, isVideoMuted]);

  const toggleAudio = () => {
    setIsAudioMuted(!isAudioMuted);
  };

  const toggleVideo = () => {
    setIsVideoMuted(!isVideoMuted);
  };

  const handleReactionSelect = (emoji) => {
    onSendReaction(emoji);
    setShowReactionPanel(false);
  };

  return (
    <ControlsBarContainer>
      <ControlButton onClick={toggleAudio}>{isAudioMuted ? 'Unmute' : 'Mute'}</ControlButton>
      <ControlButton onClick={toggleVideo}>{isVideoMuted ? 'Start Video' : 'Stop Video'}</ControlButton>
      <ControlButton onClick={() => setShowVirtualBackground(!showVirtualBackground)}>
        Virtual Background
      </ControlButton>
      {showVirtualBackground && <VirtualBackground />}
      <ControlButton>Share Screen</ControlButton>
      <ControlButton>Record</ControlButton>
      <ControlButton>Chat</ControlButton>
      <ControlButton onClick={() => setShowReactionPanel(!showReactionPanel)}>Reactions</ControlButton>
      {showReactionPanel && <ReactionPanel onSelect={handleReactionSelect} />}
      <ControlButton className="end-call" onClick={onLeave}>End Call</ControlButton>
    </ControlsBarContainer>
  );
};
