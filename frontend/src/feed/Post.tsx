import React from 'react';
import { Box, Avatar, Typography, IconButton } from '@mui/material';
import { Favorite, Share, Comment, Bookmark } from '@mui/icons-material';

const Post = ({ post }) => {
  return (
    <Box sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Avatar src={post.author.profile_picture_url} />
        <Box sx={{ ml: 2 }}>
          <Typography variant="subtitle1">{post.author.full_name}</Typography>
          <Typography variant="body2" color="text.secondary">{new Date(post.created_at).toLocaleString()}</Typography>
        </Box>
      </Box>
      <Typography variant="body1" sx={{ mb: 1 }}>{post.text}</Typography>
      {post.media_url && (
        <Box sx={{ mb: 1 }}>
          <img src={post.media_url} alt="Post media" style={{ maxWidth: '100%', borderRadius: '8px' }} />
        </Box>
      )}
      <Box>
        <IconButton><Favorite /></IconButton>
        <IconButton><Share /></IconButton>
        <IconButton><Comment /></IconButton>
        <IconButton><Bookmark /></IconButton>
      </Box>
    </Box>
  );
};

export default Post;
