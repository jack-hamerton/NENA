import React, { useState, useEffect } from 'react';
import { RoomVideoGrid } from './RoomVideoGrid';
import { Chat } from './Chat';
import { HostControls } from './HostControls';
import { Reactions } from './Reactions';
import { callService, Participant } from '../services/callService';

export const Room: React.FC = () => {
  const [participants, setParticipants] = useState<(Participant)[]>([]);
  const [localParticipant, setLocalParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    const handleParticipantsChanged = (allParticipants: Participant[]) => {
      setParticipants(allParticipants);
      setLocalParticipant(allParticipants.find(p => p.isLocal) || null);
    };

    callService.on('participantsChanged', handleParticipantsChanged);

    // Join the call when the component mounts
    callService.joinCall('my-room', 'Local User');

    return () => {
      // Leave the call when the component unmounts
      callService.leaveCall();
      callService.off('participantsChanged', handleParticipantsChanged);
    };
  }, []);

  if (!localParticipant) {
    return <div>Joining call...</div>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <HostControls />
      <RoomVideoGrid participants={participants} localParticipant={localParticipant} />
      <Chat channelId="group-chat" localParticipant={{ id: localParticipant.id, name: localParticipant.name }} />
      <Reactions reactions={[]} />
    </div>
  );
};
