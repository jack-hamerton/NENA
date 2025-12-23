
import React, { useState } from 'react';
import styled from 'styled-components';
import UserAvatar from '../components/UserAvatar';
import CommentSection from '../comments/CommentSection';
import { likePost, resharePost } from '../services/post.service';
import { useAuth } from '../hooks/useAuth';
import { IconButton, Typography } from '@mui/material';
import { FavoriteBorder, Favorite, Repeat, Comment as CommentIcon } from '@mui/icons-material';

const Card = styled.div`
  background-color: ${props => props.theme.palette.background.paper};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
`;

const PostText = styled.p`
  color: ${props => props.theme.text.primary};
  margin: 1rem 0;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  border-top: 1px solid ${props => props.theme.palette.dark};
  border-bottom: 1px solid ${props => props.theme.palette.dark};
  padding: 0.25rem 0;
  margin-top: 1rem;
`;

const Action = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.text.secondary};
  cursor: pointer;

  &:hover {
    color: ${props => (props.disabled ? props.theme.text.disabled : props.theme.palette.accent)};
  }

  &.liked {
    color: ${props => props.theme.palette.accent};
  }
`;

const PostCard = ({ post, onReportPost }) => {
  const { user: currentUser, following } = useAuth();
  const [likes, setLikes] = useState(post.likes || 0);
  const [hasLiked, setHasLiked] = useState(post.hasLiked || false);
  const [showComments, setShowComments] = useState(false);

  const canReshare = following.some(followedUser => followedUser.id === post.author.id);

  const handleLike = async () => {
    if (hasLiked) return;
    try {
      await likePost(post.id);
      setLikes(likes + 1);
      setHasLiked(true);
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleReshare = async () => {
    if (!canReshare) return;
    try {
      await resharePost(post.id);
      // A real implementation would trigger a notification here.
      // For now, we can just log it.
      console.log(`Post ${post.id} reshared! A notification would be sent.`);
    } catch (error) {
      console.error("Failed to reshare post:", error);
    }
  };

  return (
    <Card>
      <UserAvatar user={post.author} />
      <PostText>{post.text}</PostText>
      
      <ActionsContainer>
        <Action onClick={handleLike} className={hasLiked ? 'liked' : ''}>
          <IconButton disabled={hasLiked}>
            {hasLiked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <Typography variant="body2">{likes}</Typography>
        </Action>

        <Action onClick={() => setShowComments(!showComments)}>
          <IconButton>
            <CommentIcon />
          </IconButton>
        </Action>

        <Action onClick={handleReshare} disabled={!canReshare}>
          <IconButton disabled={!canReshare}>
            <Repeat />
          </IconButton>
        </Action>
      </ActionsContainer>

      {showComments && <CommentSection post={post} />}

    </Card>
  );
};

export default PostCard;
