import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface WhiteboardProps {
  roomId: string;
}

export const Whiteboard = ({ roomId }: WhiteboardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const socket: Socket = io('http://localhost:3001'); // Replace with your server URL

    socket.emit('join-room', roomId);

    socket.on('drawing', () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.getContext('2d');
      // Draw received data on canvas
    });

    return () => {
      socket.close();
    };
  }, [roomId]);

  const handleMouseDown = () => {
    // Start drawing
  };

  const handleMouseMove = () => {
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
