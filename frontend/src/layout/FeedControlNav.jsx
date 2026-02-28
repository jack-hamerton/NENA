
import React from 'react';
import styled from 'styled-components';
import { Button, useMediaQuery, useTheme, BottomNavigation, BottomNavigationAction } from '@mui/material';
import ForYouIcon from '@mui/icons-material/Home';
import FollowingIcon from '@mui/icons-material/People';
import CreateIcon from '@mui/icons-material/AddCircleOutline';

const NavContainer = styled.nav`
  position: sticky;
  top: 0;
  height: 100vh;
  padding: 1rem;
  border-right: 1px solid ${props => props.theme.palette.divider};
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MobileNav = styled(BottomNavigation)`
  position: fixed;
  bottom: 0;
  width: 100%;
  border-top: 1px solid ${props => props.theme.palette.divider};
  background-color: ${props => props.theme.palette.background.paper};
  z-index: 100;
`;

const FeedControlNav = ({
  feedType,
  setFeedType,
  setCreatePostModalOpen,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  if (isMobile) {
    return (
        <MobileNav
            value={feedType}
            onChange={(event, newValue) => {
                setFeedType(newValue);
            }}
            showLabels
        >
            <BottomNavigationAction label="For You" value="for-you" icon={<ForYouIcon />} />
            <BottomNavigationAction label="Following" value="following" icon={<FollowingIcon />} />
            <BottomNavigationAction label="Post" icon={<CreateIcon />} onClick={() => setCreatePostModalOpen(true)} />
        </MobileNav>
    );
  }

  return (
    <NavContainer theme={theme}>
        <img src="/nena-log.png" alt="NenaSpace Logo" style={{ width: '50px', marginBottom: '1rem' }} />
        <Button
            onClick={() => setFeedType('for-you')}
            variant={feedType === 'for-you' ? 'contained' : 'text'}
            startIcon={<ForYouIcon />}
            sx={{ justifyContent: 'flex-start' }}
        >
            For You
        </Button>
        <Button
            onClick={() => setFeedType('following')}
            variant={feedType === 'following' ? 'contained' : 'text'}
            startIcon={<FollowingIcon />}
            sx={{ justifyContent: 'flex-start' }}
        >
            Following
        </Button>
        <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setCreatePostModalOpen(true)} 
            sx={{ mt: 2, borderRadius: '9999px' }}
        >
            Post
        </Button>
    </NavContainer>
  );
};

export default FeedControlNav;
