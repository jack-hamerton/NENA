import { useState } from 'react';
import { Button } from '@mui/material';
import AIModal from './AIModal';

export const RoomControls = ({ onLeave, roomTranscript }) => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsAIModalOpen(true)}>AI</Button>
      <Button onClick={onLeave}>Leave</Button>
      <AIModal
        open={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        roomTranscript={roomTranscript}
      />
    </div>
  );
};