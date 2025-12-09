import React from 'react';

export const RoomControls = ({ onLeave }) => {
  return (
    <div>
      <button onClick={onLeave}>Leave</button>
    </div>
  );
};