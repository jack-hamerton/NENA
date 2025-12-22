
import { useEffect, useState } from 'react';
import { Post } from '../components/post/Post.jsx';
import CreatePost from '../components/post/CreatePost.jsx';
import { usePosts } from '../hooks/usePosts';
import { Container, Typography } from '@mui/material';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme/theme';

export const ActivityFeed = () => {
  const { getFollowingFeed } = usePosts();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await getFollowingFeed();
      setPosts(response.data);
    };

    fetchPosts();
  }, [getFollowingFeed]);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1" gutterBottom>
          Activity Feed
        </Typography>
        <CreatePost />
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </Container>
    </ThemeProvider>
  );
};
