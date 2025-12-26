
import React, { useState } from 'react';
import { Box, TextField, Button, Menu, MenuItem } from '@mui/material';
import { rewriteText } from '../services/aiService';

export const CommentComposer = ({ postId, parentId, onCommentSubmitted }) => {
  const [comment, setComment] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCommentSubmitted({ text: comment, postId, parentId });
    setComment('');
  };

  const handleAiAssistClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAiAssistClose = () => {
    setAnchorEl(null);
  };

  const handleRewrite = async (tone) => {
    const rewrittenText = await rewriteText(comment, tone);
    setComment(rewrittenText);
    handleAiAssistClose();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button type="submit" variant="contained" sx={{ mt: 1 }}>
        Comment
      </Button>
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
    </Box>
  );
};
