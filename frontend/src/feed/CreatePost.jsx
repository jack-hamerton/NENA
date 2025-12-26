import React, { useState } from 'react';
import { Box, TextField, Button, Menu, MenuItem, Typography, Card, CardContent } from '@mui/material';
import { CreatePoll } from '../rooms/CreatePoll';
import { postService } from '../services/postService';
import { rewriteText, suggestNextSteps } from '../services/aiService';

interface Poll {
  question: string;
  options: string[];
}

const CreatePost = () => {
  const [text, setText] = useState('');
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const handlePostSubmit = async () => {
    await postService.createPost({ text });
    const nextSteps = await suggestNextSteps(text);
    setSuggestions(nextSteps.suggestions);
    setText('');
  };

  const handlePollCreated = async (newPoll: Poll) => {
    await postService.createPost({ text, poll: newPoll });
    const nextSteps = await suggestNextSteps(text);
    setSuggestions(nextSteps.suggestions);
    setText('');
    setIsPollModalOpen(false);
  };

  const handleAiAssistClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAiAssistClose = () => {
    setAnchorEl(null);
  };

  const handleRewrite = async (tone) => {
    const rewrittenText = await rewriteText(text, tone);
    setText(rewrittenText);
    handleAiAssistClose();
  };

  return (
    <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="What's on your mind?"
        variant="outlined"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button variant="contained" sx={{ mt: 1 }} onClick={handlePostSubmit}>Post</Button>
      <Button variant="outlined" sx={{ mt: 1, ml: 1 }} onClick={() => setIsPollModalOpen(true)}>Create Poll</Button>
      <Button
        aria-controls="ai-assist-menu"
        aria-haspopup="true"
        onClick={handleAiAssistClick}
        variant="outlined"
        sx={{ mt: 1, ml: 1 }}
      >
        AI Assist
      </Button>
      <Menu
        id="ai-assist-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleAiAssistClose}
      >
        <MenuItem onClick={() => handleRewrite('formal')}>Formal</MenuItem>
        <MenuItem onClick={() => handleRewrite('friendly')}>Friendly</MenuItem>
        <MenuItem onClick={() => handleRewrite('respectful')}>Respectful</MenuItem>
        <MenuItem onClick={() => handleRewrite('concise')}>Concise</MenuItem>
      </Menu>

      {isPollModalOpen && (
        <CreatePoll onPollCreated={handlePollCreated} />
      )}

      {suggestions.length > 0 && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6">Next Step Suggestions</Typography>
            <ul>
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default CreatePost;
