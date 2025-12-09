import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { CreatePoll } from '../rooms/CreatePoll';
import { postService } from '../services/postService';

const CreatePost = () => {
  const [text, setText] = useState('');
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);

  const handlePostSubmit = async () => {
    await postService.createPost({ text });
    setText('');
  };

  const handlePollCreated = async (newPoll: any) => {
    await postService.createPost({ text, poll: newPoll });
    setText('');
    setIsPollModalOpen(false);
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

      {isPollModalOpen && (
        <CreatePoll onPollCreated={handlePollCreated} />
      )}
    </Box>
  );
};

export default CreatePost;
