
import React, { useRef, useEffect, useState } from 'react';
import { Participant } from '../services/callService';
import './ParticipantTile.css';

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
    <div className="participant-tile-container" style={{ backgroundImage: `url(${background})` }}>
      <video ref={videoRef} autoPlay muted={participant.isLocal} />
      <div className="participant-identity">{participant.identity}</div>
    </div>
  );
};
