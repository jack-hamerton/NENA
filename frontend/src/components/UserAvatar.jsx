import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Avatar } from '@mui/material';

const AvatarContainer = styled.div`
  cursor: pointer;
`;

const UserAvatar = ({ user, size = 'medium' }) => {
    const avatarSize = {
        small: '32px',
        medium: '48px',
        large: '96px',
    };

    return (
        <Link to={`/profile/${user.id}`}>
            <Avatar
                src={user.profilePicture}
                alt={user.username}
                sx={{
                    width: avatarSize[size],
                    height: avatarSize[size],
                }}
            />
        </Link>
    );
};

export default UserAvatar;
