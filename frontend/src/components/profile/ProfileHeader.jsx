
import React, { useRef } from 'react';
import styled from 'styled-components';
import { Avatar, Button, Typography, useTheme, useMediaQuery } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { uploadImage } from '../../services/image.service';
import { updateProfile } from '../../services/user.service';
import { useAuth } from '../../contexts/AuthContext';

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;
  padding: 0 1rem; /* Add padding for smaller screens */
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

const RoleBadge = styled(Typography)`
  font-weight: bold;
  margin-top: 0.5rem;
`;

const Tagline = styled(Typography)`
  font-style: italic;
  margin-bottom: 1rem;
  max-width: 600px;
`;

const StatsContainer = styled.div`
    display: flex;
    gap: 1.5rem;
    margin: 1rem 0;
    color: ${props => props.theme.palette.text.secondary};
`;

const FollowButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
  width: 100%;
  max-width: 300px; /* Max width for mobile button stack */

  /* On screens larger than sm, switch to row */
  ${({ theme }) => theme.breakpoints.up('sm')} {
    flex-direction: row;
    gap: 1rem;
    width: auto;
    max-width: none;
  }
`;

const ProfileHeader = ({ user, followerCount, followingCount, onFollow }) => {
  const fileInputRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user: authUser, setUser: setAuthUser } = useAuth();

  const handleAvatarClick = () => {
    if (authUser && authUser.id === user.id) {
        fileInputRef.current.click();
    }
  };
  
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const imageUrl = await uploadImage(file);
        await updateProfile(user.id, { profile_picture_url: imageUrl });
        
        setAuthUser(prevUser => ({
            ...prevUser,
            profilePicture: imageUrl,
        }));

      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
    }
  };

  const isOwnProfile = authUser && authUser.id === user.id;

  return (
    <HeaderContainer>
        <AvatarContainer onClick={isOwnProfile ? handleAvatarClick : undefined}>
            <Avatar src={user.profilePicture} sx={{ width: isMobile ? 90 : 120, height: isMobile ? 90 : 120, mb: 2 }} />
            {isOwnProfile && (
                <EditIconOverlay className="edit-icon">
                    <EditIcon />
                </EditIconOverlay>
            )}
        </AvatarContainer>

      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/png, image/jpeg, image/gif" 
      />

      <Typography variant={isMobile ? 'h5' : 'h4'}>{user.displayName}</Typography>
      <Typography variant="body1" color="text.secondary">@{user.handle}</Typography>
      <RoleBadge variant="body1">👑 {user.role}</RoleBadge>
      <Tagline variant="body2">{user.tagline}</Tagline>
      
      <StatsContainer theme={theme}>
        <Typography><b>{followerCount}</b> Followers</Typography>
        <Typography><b>{followingCount}</b> Following</Typography>
      </StatsContainer>

      {!isOwnProfile && (
        <FollowButtonGroup theme={theme}>
            <Button variant="contained" color="success" onClick={() => onFollow('supporter')}>Follow as Supporter</Button>
            <Button variant="contained" color="warning" onClick={() => onFollow('amplifier')}>Follow as Amplifier</Button>
            <Button variant="contained" color="info" onClick={() => onFollow('learner')}>Follow as Learner</Button>
        </FollowButtonGroup>
      )}
    </HeaderContainer>
  );
};

export default ProfileHeader;
