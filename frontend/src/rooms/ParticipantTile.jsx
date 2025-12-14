
import React, { useRef, useEffect } from 'react';
import { Participant } from '../services/callService';

interface ParticipantTileProps {
  participant: Participant;
}

export const ParticipantTile: React.FC<ParticipantTileProps> = ({ participant }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (participant.videoStream && videoRef.current) {
      videoRef.current.srcObject = participant.videoStream;
    }
  }, [participant.videoStream]);

  return (
    <div>
      <video ref={videoRef} autoPlay muted={participant.isLocal} />
      <div>{participant.identity}</div>
    </div>
  );
};
