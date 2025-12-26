import { useState } from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import { summarize, suggestNextSteps } from '../services/aiService';

const AIModal = ({ open, onClose, roomTranscript }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSummarize = async () => {
    setLoading(true);
    setResult('');
    try {
      const res = await summarize(roomTranscript);
      setResult(res.data.summary);
    } catch (error) {
      console.error('Error summarizing:', error);
      setResult('Error: Could not summarize the discussion.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestNextSteps = async () => {
    setLoading(true);
    setResult('');
    try {
      const res = await suggestNextSteps(roomTranscript);
      setResult(res.data.nextSteps);
    } catch (error) {
      console.error('Error suggesting next steps:', error);
      setResult('Error: Could not suggest next steps.');
    } finally {
      setLoading(false);
    }
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          AI Assistant
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button onClick={handleSummarize} disabled={loading}>
            {loading ? 'Summarizing...' : 'Summarize Discussion'}
          </Button>
          <Button onClick={handleSuggestNextSteps} disabled={loading} sx={{ ml: 2 }}>
            {loading ? 'Suggesting...' : 'Suggest Next Steps'}
          </Button>
        </Box>
        {result && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">{result}</Typography>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default AIModal;
