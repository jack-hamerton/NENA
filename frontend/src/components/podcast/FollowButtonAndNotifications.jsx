
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';

const FollowButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
`;

const FollowButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  background: ${props => (props.isFollowing ? theme.palette.tertiary : theme.palette.accent)};
  color: ${theme.text.primary};
  cursor: pointer;

  &:hover {
    background: ${theme.palette.secondary};
  }
`;

const NotificationText = styled.p`
  color: ${theme.text.secondary};
  margin: 0;
`;

const FollowButtonAndNotifications = ({ podcast }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [intendToListen, setIntendToListen] = useState(false);

  useEffect(() => {
    if (podcast) {
      const savedStatus = localStorage.getItem(`following_${podcast.id}`);
      if (savedStatus) {
        const status = JSON.parse(savedStatus);
        setIsFollowing(status.isFollowing);
        setIntendToListen(status.intendToListen);
      }
    }
  }, [podcast]);

  const handleFollow = () => {
    if (podcast) {
      const newFollowingStatus = !isFollowing;
      const newIntendToListen = newFollowingStatus; // Set intend to listen when following

      setIsFollowing(newFollowingStatus);
      setIntendToListen(newIntendToListen);

      localStorage.setItem(
        `following_${podcast.id}`,
        JSON.stringify({ isFollowing: newFollowingStatus, intendToListen: newIntendToListen })
      );

      if (newFollowingStatus) {
        console.log(`User is now following ${podcast.title} and intends to listen.`);
        // Here you can also trigger a notification
      }
    }
  };

  return (
    <FollowButtonContainer>
      {podcast && (
        <FollowButton isFollowing={isFollowing} onClick={handleFollow}>
          {isFollowing ? 'Following' : 'Follow'}
        </FollowButton>
      )}
      {isFollowing && <NotificationText>You will be notified of new episodes.</NotificationText>}
      {intendToListen && <NotificationText>You intend to listen to new episodes.</NotificationText>}
    </FollowButtonContainer>
  );
};

export default FollowButtonAndNotifications;
