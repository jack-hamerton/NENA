import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const CallWindowContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 400px;
  background: #2c2c2c;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  z-index: 100;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden; // Keep draggable video within bounds
`;

const CallHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  transition: opacity 0.3s;
`;

const CallTimer = styled.div`
    font-size: 1rem;
    font-weight: normal;
`;

const VideoContainer = styled.div`
  position: relative; // Needed for absolute positioning of MyVideo
  flex-grow: 1;
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
`;

const MyVideoContainer = styled.div`
  position: absolute;
  width: 150px;
  height: 150px;
  background: #000;
  border: 1px solid #444;
  z-index: 101; // Appear above other video
  cursor: move;
`;

const MyVideo = styled.video`
  width: 100%;
  height: 100%;
`;

const UserVideoContainer = styled.div`
    flex-grow: 1;
    position: relative;
`;

const UserVideo = styled.video`
  width: 100%;
  height: 100%;
  background: #000;
  border: 1px solid #444;
`;

const ScreenShareView = styled.div`
  flex-grow: 1;
  background: #333;
  border: 1px solid #444;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.5rem;
`;

const MuteIcon = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 3rem;
    color: white;
    background: rgba(0, 0, 0, 0.5);
    padding: 1rem;
    border-radius: 50%;
`;

const ConnectingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  z-index: 102;
`;

const CallFooter = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  transition: opacity 0.3s;

  button {
    background: #3a3a3a;
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    &:disabled {
        background: #555;
        cursor: not-allowed;
    }

    &.end-call {
        background: #f44336;
    }

    &.active {
        background: #555;
    }
  }
`;

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

const CallWindow = ({ call, onEndCall, myVideo, userVideo, isMuted, toggleMute, isCameraOff, toggleCamera, callTimer, isScreenSharing, toggleScreenSharing, isRemoteMuted }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [isControlsVisible, setIsControlsVisible] = useState(true);
    const dragStartPos = useRef(null);
    const inactivityTimer = useRef(null);
    const isConnected = call.status === 'connected';

    const handleMouseDown = (e) => {
        if(!isConnected) return;
        setDragging(true);
        dragStartPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
        setIsControlsVisible(true);
        clearTimeout(inactivityTimer.current);
        inactivityTimer.current = setTimeout(() => setIsControlsVisible(false), 3000);

        if (!dragging) return;
        const dx = e.clientX - dragStartPos.current.x;
        const dy = e.clientY - dragStartPos.current.y;
        setPosition({
            x: position.x + dx,
            y: position.y + dy
        });
        dragStartPos.current = { x: e.clientX, y: e.clientY };
    }