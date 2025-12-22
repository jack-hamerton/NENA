
import React, { useState } from 'react';
import styled from 'styled-components';
import { VirtualBackground } from './VirtualBackground';

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

export const ControlsBar: React.FC = () => {
  const [showVirtualBackground, setShowVirtualBackground] = useState(false);

  return (
    <ControlsBarContainer>
      <ControlButton>Mute</ControlButton>
      <ControlButton>Stop Video</ControlButton>
      <ControlButton onClick={() => setShowVirtualBackground(!showVirtualBackground)}>
        Virtual Background
      </ControlButton>
      {showVirtualBackground && <VirtualBackground />}
      <ControlButton>Share Screen</ControlButton>
      <ControlButton>Record</ControlButton>
      <ControlButton>Chat</ControlButton>
      <ControlButton>Reactions</ControlButton>
      <ControlButton className="end-call">End Call</ControlButton>
    </ControlsBarContainer>
  );
};
