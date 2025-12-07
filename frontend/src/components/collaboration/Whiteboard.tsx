import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const Whiteboard = ({ roomId }) => {
  const canvasRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001'); // Replace with your server URL
    setSocket(newSocket);

    newSocket.emit('join-room', roomId);

    newSocket.on('drawing', (data) => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      // Draw received data on canvas
    });

    return () => newSocket.close();
  }, [roomId]);

  const handleMouseDown = (e) => {
    // Start drawing
  };

  const handleMouseMove = (e) => {
    // Draw
  };

  const handleMouseUp = () => {
    // Stop drawing
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ border: '1px solid black' }}
    />
  );
};
