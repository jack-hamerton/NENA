
import React from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const NavContainer = styled.nav`
  background-color: ${props => props.theme.palette.background.paper};
  padding: 20px 10px;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: transform 0.3s ease-in-out, width 0.3s ease-in-out;

  @media (max-width: ${props => props.theme.breakpoints.values.sm}px) {
    position: fixed;
    top: 50%;
    left: 20px;
    transform: translateY(-50%) translateX(${props => props.isOpen ? '0' : '-150%'});
  }

  @media (min-width: ${props => props.theme.breakpoints.values.sm}px) {
    position: static;
    transform: none;
    height: 100%;
    border-radius: 0;
    box-shadow: none;
    border-right: 1px solid ${props => props.theme.palette.divider};
  }
`;

const NavLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const FeedControlButton = styled(Button)`
  &.active {
    background-color: ${props => props.theme.palette.accent.main};
    color: ${props => props.theme.palette.accent.contrastText};
    &:hover {
      background-color: ${props => props.theme.palette.accent.dark};
    }
  }
`;

const FeedControlNav = ({
  isOpen,
  feedType,
  setFeedType,
  handleRestart,
  setCreatePostModalOpen,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <NavContainer isOpen={isOpen} theme={theme}>
      <NavLinks>
        <FeedControlButton
          onClick={() => setFeedType('for-you')}
          className={feedType === 'for-you' ? 'active' : ''}
          variant={feedType === 'for-you' ? 'contained' : 'text'}
        >
          For You
        </FeedControlButton>
        <FeedControlButton
          onClick={() => setFeedType('following')}
          className={feedType === 'following' ? 'active' : ''}
          variant={feedType === 'following' ? 'contained' : 'text'}
        >
          Following
        </FeedControlButton>
        <FeedControlButton onClick={handleRestart}>Restart</FeedControlButton>
        <FeedControlButton onClick={() => setCreatePostModalOpen(true)} variant="outlined">
          Create Post
        </FeedControlButton>
      </NavLinks>
    </NavContainer>
  );
};

export default FeedControlNav;
