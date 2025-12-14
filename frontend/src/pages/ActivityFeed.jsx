import { useEffect, useState } from 'react';
import { Post } from '../components/post/Post.jsx';
import CreatePost from '../components/post/CreatePost.jsx';
import { usePosts } from '../hooks/usePosts';
import { Container, Typography } from '@mui/material';

export const ActivityFeed = () => {
  const { getForYouFeed, reportPost } = usePosts();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await getForYouFeed();
      setPosts(response.data);
    };

    fetchPosts();
  }, [getForYouFeed]);

  const handleReportPost = async (postId) => {
    await reportPost(postId);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Activity Feed
      </Typography>
      <CreatePost />
      {posts.map((post) => (
        <Post key={post.id} postId={post.id} />
      ))}
    </Container>
  );
};
