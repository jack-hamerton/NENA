
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import { useRef } from 'react';
import { userService } from '../services/userService';
import { useAuth } from '../hooks/useAuth';

const UserAvatar = ({ user }) => {
  const { user: currentUser, setUser } = useAuth();
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    if (currentUser?.id === user?.id) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const updatedUser = await userService.uploadProfilePicture(file);
        setUser(updatedUser);
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton onClick={handleAvatarClick} disabled={currentUser?.id !== user?.id}>
        <Avatar alt={user?.name} src={user?.profilePicture} sx={{ width: 32, height: 32 }} />
      </IconButton>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*"
      />
      <Typography variant="body1" sx={{ marginLeft: 1 }}>
        @{user?.username}
      </Typography>
    </Box>
  );
};

export default UserAvatar;
