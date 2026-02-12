
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';
import { checkFollowStatus, followPodcast, unfollowPodcast } from '../../services/follow.service';
import { CircularProgress, Typography } from '@mui/material';

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
  background: ${props => (props.isFollowing ? theme.palette.tertiary.main : theme.palette.primary.main)};
  color: ${theme.palette.text.primary};
  cursor: pointer;

  &:hover {
    background: ${props => (props.isFollowing ? theme.palette.tertiary.dark : theme.palette.primary.dark)};
  }
`;

const NotificationText = styled.p`
  color: ${theme.palette.text.secondary};
  margin: 0;
`;

const FollowButtonAndNotifications = ({ podcast }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = 1; // Hardcoded user ID for now

  useEffect(() => {
    if (podcast && userId) {
      setLoading(true);
      checkFollowStatus(podcast.id, userId)
        .then(response => {
          setIsFollowing(response.data.is_following);
          setLoading(false);
        })
        .catch(err => {
          setError('Error fetching follow status');
          setLoading(false);
          console.error(err);
        });
    }
  }, [podcast, userId]);

  const handleFollow = () => {
    if (podcast && userId) {
      setLoading(true);
      const followAction = isFollowing
        ? unfollowPodcast(podcast.id, userId)
        : followPodcast(podcast.id, userId);

      followAction
        .then(() => {
          setIsFollowing(!isFollowing);
          setLoading(false);
        })
        .catch(err => {
          setError('Error updating follow status');
          setLoading(false);
          console.error(err);
        });
    }
  };

  if (loading) return <CircularProgress size={24} />;
  if (error) return <Typography color="error" variant="caption">{error}</Typography>;

  return (
    <FollowButtonContainer>
      {podcast && (
        <FollowButton isFollowing={isFollowing} onClick={handleFollow}>
          {isFollowing ? 'Following' : 'Follow'}
        </FollowButton>
      )}
      {isFollowing && <NotificationText>You will be notified of new episodes.</NotificationText>}
    </FollowButtonContainer>
  );
};

export default FollowButtonAndNotifications;
