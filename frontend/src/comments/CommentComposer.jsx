
import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

export const CommentComposer = ({ postId, parentId, onCommentSubmitted }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCommentSubmitted({ text: comment, postId, parentId });
    setComment('');
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
    </Box>
  );
};
