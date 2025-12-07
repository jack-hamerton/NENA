import React from 'react';
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import { Post as PostType } from '../types/post';

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ mr: 2 }} />
          <Typography variant="h6">User {post.userId}</Typography>
        </Box>
        <Typography>{post.content}</Typography>
      </CardContent>
    </Card>
  );
};

export default Post;
