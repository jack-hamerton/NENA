import React from 'react';
import './ControlsBar.css';

export const ControlsBar: React.FC = () => {
  return (
    <div className="controls-bar">
      <button className="control-button">Mute</button>
      <button className="control-button">Stop Video</button>
      <button className="control-button">Share Screen</button>
      <button className="control-button">Record</button>
      <button className="control-button">Chat</button>
      <button className="control-button">Reactions</button>
      <button className="control-button end-call">End Call</button>
    </div>
  );
};
