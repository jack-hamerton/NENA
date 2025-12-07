import { Box } from '@mui/material';
import CreatePost from './CreatePost';
import Post from './Post';

const mockPosts = [
  {
    id: 1,
    user: { name: 'John Doe', avatar: '/avatars/avatar1.jpg' },
    content: 'This is a sample post!',
    timestamp: '2 hours ago',
  },
  // Add more mock posts here
];

const FeedPage = () => {
  return (
    <Box>
      <CreatePost />
      {mockPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </Box>
  );
};

export default FeedPage;
