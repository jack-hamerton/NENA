
import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Participant } from '../services/callService';

const ParticipantTileContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  overflow: hidden;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ParticipantIdentity = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px;
  border-radius: 5px;
`;

interface ParticipantTileProps {
  participant: Participant;
}

export const ParticipantTile: React.FC<ParticipantTileProps> = ({ participant }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [background, setBackground] = useState('/backgrounds/background1.jpg');

  useEffect(() => {
    if (participant.videoStream && videoRef.current) {
      videoRef.current.srcObject = participant.videoStream;
    }
  }, [participant.videoStream]);

  return (
    <ParticipantTileContainer style={{ backgroundImage: `url(${background})` }}>
      <video ref={videoRef} autoPlay muted={participant.isLocal} />
      <ParticipantIdentity>{participant.identity}</ParticipantIdentity>
    </ParticipantTileContainer>
  );
};
