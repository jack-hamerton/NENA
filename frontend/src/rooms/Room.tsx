
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { roomService } from '../services/roomService';
import { callService, Participant } from '../services/callService';
import { RoomVideoGrid } from './RoomVideoGrid';
import { ControlsBar } from './ControlsBar';

interface RoomParams {
  roomId: string;
}

export const Room: React.FC = () => {
  const { roomId } = useParams<RoomParams>();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  useEffect(() => {
    const join = async () => {
      await roomService.joinRoom(roomId);
      const stream = await callService.joinCall(roomId, localVideoRef.current);
      // Mute the local video by default to avoid echo
      if (localVideoRef.current) {
        localVideoRef.current.muted = true;
      }
      setParticipants(callService.getParticipants());

      callService.on('participants-changed', () => {
        setParticipants([...callService.getParticipants()]);
      });
    };
    join();

    return () => {
      callService.leaveCall();
      roomService.leaveRoom(roomId);
    };
  }, [roomId]);

  const handleToggleMute = () => {
    callService.toggleMute();
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    callService.toggleVideo();
    setIsVideoEnabled(!isVideoEnabled);
  };

  const handleToggleScreenShare = () => {
    callService.toggleScreenShare();
    setIsScreenSharing(!isScreenSharing);
  };

  return (
    <div>
      <RoomVideoGrid participants={participants} localVideoRef={localVideoRef} />
      <ControlsBar
        isMuted={isMuted}
        isVideoEnabled={isVideoEnabled}
        isScreenSharing={isScreenSharing}
        onToggleMute={handleToggleMute}
        onToggleVideo={handleToggleVideo}
        onToggleScreenShare={handleToggleScreenShare}
        onLeave={() => {}}
      />
    </div>
  );
};
