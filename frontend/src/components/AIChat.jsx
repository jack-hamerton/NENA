import { useState } from 'react';
import { useAI } from '../hooks/useAI';
import { Paper, TextField, Button, Typography, Box } from '@mui/material';

const AIChat = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { conversation } = useAI();

  const handleSend = async () => {
    if (!prompt) return;
    setLoading(true);
    const newMessages = [...messages, { sender: 'user', text: prompt }];
    setMessages(newMessages);
    setPrompt('');
    try {
      const res = await conversation(prompt);
      setMessages([...newMessages, { sender: 'ai', text: res.data.response }]);
    } catch (error) {
      console.error('Error communicating with AI:', error);
      setMessages([...newMessages, { sender: 'ai', text: 'Error: Could not get a response from the AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', backgroundColor: '#1e1e1e' }}>
        {messages.map((msg, index) => (
          <Box key={index} sx={{ mb: 2, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <Typography
              variant="body1"
              sx={{
                display: 'inline-block',
                p: 1,
                borderRadius: '10px',
                backgroundColor: msg.sender === 'user' ? 'primary.main' : '#333',
                color: 'white',
              }}
            >
              {msg.text}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ p: 2, backgroundColor: '#1e1e1e' }}>
        <TextField
          fullWidth
          label="Ask Nena..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
          disabled={loading}
          variant="outlined"
          sx={{ input: { color: 'white' }, label: { color: 'gray' } }}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={loading || !prompt}
          sx={{ mt: 1, width: '100%' }}
        >
          {loading ? 'Thinking...' : 'Send'}
        </Button>
      </Box>
    </Paper>
  );
};

export default AIChat;
