
import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, TextField, Typography, Card, CardMedia } from '@mui/material';
import { usePosts } from '../../hooks/usePosts';

const CreatePostContainer = styled.div`
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const { createPost } = usePosts();

  const handleCreatePost = async () => {
    await createPost({ content, media_url: mediaUrl });
    setContent('');
    setMediaUrl('');
  };

  return (
    <CreatePostContainer>
      <Typography variant="h6">Create a New Post</Typography>
      <TextField
        label="What's on your mind?"
        variant="outlined"
        multiline
        rows={4}
        fullWidth
        value={content}
        onChange={(e) => setContent(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Media URL (optional)"
        variant="outlined"
        fullWidth
        value={mediaUrl}
        onChange={(e) => setMediaUrl(e.target.value)}
        margin="normal"
      />
      {mediaUrl && (
        <Card sx={{ maxWidth: 345, mb: 2 }}>
          <CardMedia component="img" image={mediaUrl} alt="Media Preview" />
        </Card>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreatePost}
        disabled={!content}
      >
        Post
      </Button>
    </CreatePostContainer>
  );
};

export default CreatePost;
