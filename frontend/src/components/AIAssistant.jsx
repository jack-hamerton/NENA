
import { useState, useEffect, useRef } from 'react';
import { useAI } from '../hooks/useAI';
import { Paper, TextField, Button, Typography, Box, IconButton, Switch } from '@mui/material';

const AIAssistant = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { conversation } = useAI();
  const [isConsentGiven, setIsConsentGiven] = useState(false);

  // Draggable state
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, initialX: 0, initialY: 0 });
  const wasDragged = useRef(false);

  const handleDragStart = (e) => {
    if (e.button !== 0) return; // Only drag with left mouse button
    setIsDragging(true);
    wasDragged.current = false;
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
      wasDragged.current = true;
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

  const handleButtonClick = () => {
    if (!wasDragged.current) {
      setIsOpen(true);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="contained"
        onMouseDown={handleDragStart}
        onClick={handleButtonClick}
        sx={{
          position: 'fixed',
          bottom: position.y,
          right: position.x,
          borderRadius: '50%',
          width: '64px',
          height: '64px',
          zIndex: 1300,
          backgroundColor: 'primary.main',
          cursor: 'move',
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
                <Typography variant="h6">Nena AI</Typography>
            </Box>
            <IconButton onClick={() => setIsOpen(false)} size="small" sx={{ color: 'primary.contrastText' }}>
                <Typography>▼</Typography>
            </IconButton>
        </Box>
        <Box sx={{ p: 2, overflowY: 'auto', maxHeight: 400, backgroundColor: 'background.paper' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">Enable Nena AI</Typography>
                <Switch
                    checked={isConsentGiven}
                    onChange={(e) => setIsConsentGiven(e.target.checked)}
                    name="consentSwitch"
                    color="primary"
                />
            </Box>
            <TextField
                fullWidth
                label="Ask Nena to do something..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
                disabled={loading || !isConsentGiven}
                multiline
                rows={2}
                variant="outlined"
            />
            <Button
                variant="contained"
                onClick={handleSend}
                disabled={loading || !prompt || !isConsentGiven}
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
