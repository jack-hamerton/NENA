import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Post from '../components/Post';
import { Post as PostType } from '../types/post';

const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    // In a real app, you would fetch the user's feed from your API
    const mockPosts: PostType[] = [
      { id: '1', userId: '1', content: 'This is a post from a followed user.' },
      { id: '2', userId: '2', content: 'This is another post.' },
    ];
    setPosts(mockPosts);
  }, []);

  return (
    <Box>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </Box>
  );
};

export default FeedPage;
