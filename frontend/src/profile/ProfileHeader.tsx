import React from 'react';
import { Avatar, Box, Typography, Button } from '@mui/material';
import { User } from '../types/user';

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
      <Avatar sx={{ width: 100, height: 100, mr: 2 }} />
      <Box>
        <Typography variant="h4">{user.name}</Typography>
        <Typography variant="body1">{user.bio}</Typography>
        <Button variant="contained" sx={{ mt: 2 }}>Follow</Button>
      </Box>
    </Box>
  );
};

export default ProfileHeader;
