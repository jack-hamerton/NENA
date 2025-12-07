import React, { useState } from 'react';
import './HostControls.css';
import { callService } from '../services/callService';

export const HostControls: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const handleMuteToggle = () => {
    const newMutedState = !isMuted;
    callService.toggleMute(newMutedState);
    setIsMuted(newMutedState);
  };

  const handleScreenShareToggle = () => {
    const newScreenSharingState = !isScreenSharing;
    callService.toggleScreenShare(newScreenSharingState);
    setIsScreenSharing(newScreenSharingState);
  };

  return (
    <div className="host-controls">
      <h4>Host Controls</h4>
      <button onClick={handleMuteToggle}>{isMuted ? 'Unmute' : 'Mute'}</button>
      <button onClick={handleScreenShareToggle}>{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</button>
      <button>Mute All</button>
      <button>Stop All Videos</button>
      <button>Lock Meeting</button>
      <button>Waiting Room</button>
    </div>
  );
};
