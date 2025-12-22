
import React from 'react';
import styled from 'styled-components';
import { Avatar, Button, Typography } from '@mui/material';

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;
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
  return (
    <HeaderContainer>
      <Avatar src={user.profilePicture} sx={{ width: 120, height: 120, mb: 2 }} />
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
