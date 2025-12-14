import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Post } from '../types/post';

interface UserPostsProps {
  posts: Post[];
}

const UserPosts: React.FC<UserPostsProps> = ({ posts }) => {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Posts</Typography>
      {posts.map((post) => (
        <Card key={post.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography>{post.content}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default UserPosts;
