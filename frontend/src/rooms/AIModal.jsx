
import { useState } from 'react';
import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material';
import { aiService } from '../../services/aiService';

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

const AIModal = ({ open, onClose, roomTranscript }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [aiContent, setAiContent] = useState('');

  const handleAiRequest = async (type) => {
    setIsLoading(true);
    setAiContent('');
    try {
      let response;
      if (type === 'summary') {
        response = await aiService.getSummary(roomTranscript);
      } else if (type === 'keyPoints') {
        response = await aiService.getKeyPoints(roomTranscript);
      } else if (type === 'actionItems') {
        response = await aiService.getActionItems(roomTranscript);
      } else if (type === 'nextSteps') {
        response = await aiService.suggestNextSteps(roomTranscript);
      }
      setAiContent(response);
    } catch (error) {
      setAiContent(`Error: ${error.message}` || 'Error: Could not process the request.');
    }
    setIsLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6">AI Assistant</Typography>
        <Button onClick={() => handleAiRequest('summary')}>Summarize</Button>
        <Button onClick={() => handleAiRequest('keyPoints')}>Key Points</Button>
        <Button onClick={() => handleAiRequest('actionItems')}>Action Items</Button>
        <Button onClick={() => handleAiRequest('nextSteps')}>Next Steps</Button>
        {isLoading && <CircularProgress />}
        {aiContent && <Typography mt={2}>{aiContent}</Typography>}
      </Box>
    </Modal>
  );
};

export default AIModal;
