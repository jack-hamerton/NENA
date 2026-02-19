
import { useState } from 'react';
import { Button, IconButton } from '@mui/material';
import { Mic, MicOff, ScreenShare, StopScreenShare } from '@mui/icons-material';
import AIModal from './AIModal';
import { roomService } from '../../services/roomService';

export const RoomControls = ({ onLeave, roomTranscript }) => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const handleMuteToggle = () => {
    roomService.toggleMute();
    setIsMuted(!isMuted);
  };

  const handleScreenShareToggle = () => {
    roomService.toggleScreenShare();
    setIsScreenSharing(!isScreenSharing);
  };

  return (
    <div>
      <IconButton onClick={handleMuteToggle}>
        {isMuted ? <MicOff /> : <Mic />}
      </IconButton>
      <IconButton onClick={handleScreenShareToggle}>
        {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
      </IconButton>
      <Button onClick={() => setIsAIModalOpen(true)}>AI</Button>
      <Button onClick={onLeave} style={{ color: 'red' }}>Leave</Button>
      <AIModal
        open={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        roomTranscript={roomTranscript}
      />
    </div>
  );
};
