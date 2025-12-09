import { useState, useEffect, useRef } from 'react';
import { useAI } from '../hooks/useAI';
import { Paper, TextField, Button, Typography, Box, IconButton } from '@mui/material';

const AIAssistant = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { conversation } = useAI();

  // Draggable state
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, initialX: 0, initialY: 0 });

  const handleDragStart = (e) => {
    if (e.button !== 0) return; // Only drag with left mouse button
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  useEffect(() => {
    const handleDragMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPosition({
        x: dragStartRef.current.initialX - dx,
        y: dragStartRef.current.initialY - dy,
      });
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);

  const handleSend = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await conversation(prompt);
      setResponse(res.data.response);
    } catch (error) {
      console.error('Error communicating with AI:', error);
      setResponse('Error: Could not get a response from the AI.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="contained"
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          borderRadius: '50%',
          width: '64px',
          height: '64px',
          zIndex: 1300,
          backgroundColor: 'primary.main',
        }}
      >
        <Typography component="span" sx={{ fontSize: '2.5rem' }}>🤖</Typography>
      </Button>
    );
  }

  return (
    <Paper
        elevation={10}
        sx={{
            position: 'fixed',
            right: position.x,
            bottom: position.y,
            width: 350,
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '8px',
            userSelect: isDragging ? 'none' : 'auto',
        }}
    >
        <Box
            onMouseDown={handleDragStart}
            sx={{
                p: 1,
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'move',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography component="span" sx={{ fontSize: '1.5rem' }}>🤖</Typography>
                <Typography variant="h6">AI Assistant</Typography>
            </Box>
            <IconButton onClick={() => setIsOpen(false)} size="small" sx={{ color: 'primary.contrastText' }}>
                <Typography>▼</Typography>
            </IconButton>
        </Box>
        <Box sx={{ p: 2, overflowY: 'auto', maxHeight: 400, backgroundColor: 'background.paper' }}>
            <TextField
                fullWidth
                label="Ask the AI anything..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
                disabled={loading}
                multiline
                rows={2}
                variant="outlined"
            />
            <Button
                variant="contained"
                onClick={handleSend}
                disabled={loading || !prompt}
                sx={{ mt: 1, width: '100%' }}
            >
                {loading ? 'Thinking...' : 'Send'}
            </Button>
            {response && (
                <Box sx={{ mt: 2, whiteSpace: 'pre-wrap', wordBreak: 'break-word', p: 1, backgroundColor: '#2d2d2d', borderRadius: '4px' }}>
                    <Typography variant="body1">{response}</Typography>
                </Box>
            )}
        </Box>
    </Paper>
  );
};

export default AIAssistant;
