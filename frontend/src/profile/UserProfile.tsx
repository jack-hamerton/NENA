import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import ProfileHeader from './ProfileHeader';
import UserPosts from './UserPosts';
import { User } from '../types/user';
import { Post } from '../types/post';

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // In a real app, you would fetch the user and their posts from your API
    const mockUser: User = { id: userId!, name: 'John Doe', bio: 'Software Engineer' };
    const mockPosts: Post[] = [
      { id: '1', userId: userId!, content: 'Hello, world!' },
      { id: '2', userId: userId!, content: 'This is my first post.' },
    ];
    setUser(mockUser);
    setPosts(mockPosts);
  }, [userId]);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <ProfileHeader user={user} />
      <UserPosts posts={posts} />
    </Box>
  );
};

export default UserProfile;
