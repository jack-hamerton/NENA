
import React from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';

const NavContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 20px;
  transform: translateY(-50%) translateX(${props => props.isOpen ? '0' : '-150%'});
  background-color: ${props => props.theme.palette.background.paper};
  padding: 20px 10px;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: transform 0.3s ease-in-out;
`;

const NavLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const FeedControlButton = styled(Button)`
  &.active {
    background-color: ${props => props.theme.palette.accent};
  }
`;

const FeedControlNav = ({
  isOpen,
  feedType,
  setFeedType,
  handleRestart,
  setCreatePostModalOpen,
}) => {
  return (
    <NavContainer isOpen={isOpen}>
      <NavLinks>
        <FeedControlButton
          onClick={() => setFeedType('for-you')}
          className={feedType === 'for-you' ? 'active' : ''}
        >
          For You
        </FeedControlButton>
        <FeedControlButton
          onClick={() => setFeedType('following')}
          className={feedType === 'following' ? 'active' : ''}
        >
          Following
        </FeedControlButton>
        <FeedControlButton onClick={handleRestart}>Restart</FeedControlButton>
        <FeedControlButton onClick={() => setCreatePostModalOpen(true)}>
          Create Post
        </FeedControlButton>
      </NavLinks>
    </NavContainer>
  );
};

export default FeedControlNav;
