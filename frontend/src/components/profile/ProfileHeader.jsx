
import React, { useRef } from 'react';
import styled from 'styled-components';
import { Avatar, Button, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { uploadImage } from '../../services/image.service';
import { updateProfile } from '../../services/user.service';

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;
`;

const AvatarContainer = styled.div`
  position: relative;
  cursor: pointer;
  
  &:hover .edit-icon {
    opacity: 1;
  }
`;

const EditIconOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
`;


const RoleBadge = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0.5rem 0;
`;

const Tagline = styled.p`
  font-style: italic;
  margin-bottom: 1rem;
  max-width: 600px;
`;

const FollowButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ProfileHeader = ({ user, onFollow }) => {
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // 1. Upload the image and get the URL
        const imageUrl = await uploadImage(file);

        // 2. Update the user's profile
        await updateProfile(user.id, { profile_picture_url: imageUrl });

        // 3. Refresh the UI (for now, we'll log to the console)
        console.log("Profile picture updated successfully!");
        window.location.reload(); // Simple way to see the change

      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
    }
  };

  return (
    <HeaderContainer>
      <AvatarContainer onClick={handleAvatarClick}>
        <Avatar src={user.profilePicture} sx={{ width: 120, height: 120, mb: 2 }} />
        <EditIconOverlay className="edit-icon">
          <EditIcon />
        </EditIconOverlay>
      </AvatarContainer>

      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/png, image/jpeg, image/gif" 
      />

      <Typography variant="h4">{user.displayName}</Typography>
      <Typography variant="body1" color="text.secondary">@{user.handle}</Typography>
      <RoleBadge>👑 {user.role}</RoleBadge>
      <Tagline>{user.tagline}</Tagline>
      <FollowButtonGroup>
        <Button variant="contained" color="success" onClick={() => onFollow('supporter')}>Follow as Supporter</Button>
        <Button variant="contained" color="warning" onClick={() => onFollow('amplifier')}>Follow as Amplifier</Button>
        <Button variant="contained" color="info" onClick={() => onFollow('learner')}>Follow as Learner</Button>
      </FollowButtonGroup>
    </HeaderContainer>
  );
};

export default ProfileHeader;
