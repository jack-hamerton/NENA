
import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import UserAvatar from '../components/UserAvatar';
import CommentSection from '../comments/CommentSection';
import { likePost, resharePost } from '../services/post.service';
import { IconButton, Typography } from '@mui/material';
import { FavoriteBorder, Favorite, Repeat, Comment as CommentIcon } from '@mui/icons-material';
import FeedPoll from './FeedPoll';

const FullScreenCard = styled.div`
  height: 100vh;
  width: 100vw;
  scroll-snap-align: start;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
  color: #fff;
  background-color: #000; /* Assuming a dark theme for the post background */
`;

const PostContent = styled.div`
  position: absolute;
  bottom: 80px; /* Above the actions */
  left: 20px;
  right: 80px; /* Space for the vertical actions */
`;

const PostText = styled.p`
  color: #fff;
  margin-bottom: 1rem;
`;

const VerticalActions = styled.div`
  position: absolute;
  right: 20px;
  bottom: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Action = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
  cursor: pointer;

  .MuiIconButton-root {
    color: #fff;
  }

  &.liked .MuiIconButton-root {
    color: ${props => props.theme.palette.accent};
  }
`;

const PostCard = ({ post, onReportPost, onUsernameLongPress }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [hasLiked, setHasLiked] = useState(post.hasLiked || false);
  const [showComments, setShowComments] = useState(false);
  const pressTimer = useRef();

  const canReshare = post.is_following;

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
      console.log(`Post ${post.id} reshared! A notification would be sent.`);
    } catch (error) {
      console.error("Failed to reshare post:", error);
    }
  };

  const handlePressStart = useCallback(() => {
    pressTimer.current = setTimeout(() => {
      onUsernameLongPress(post.author.id);
    }, 1000); // 1-second long press
  }, [onUsernameLongPress, post.author.id]);

  const handlePressEnd = useCallback(() => {
    clearTimeout(pressTimer.current);
  }, []);

  return (
    <FullScreenCard>
      <div 
        onMouseDown={handlePressStart} 
        onMouseUp={handlePressEnd} 
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        style={{ position: 'absolute', top: '20px', left: '20px' }}
      >
        <UserAvatar user={post.author} />
      </div>
      <PostContent>
        <PostText>{post.content}</PostText>
        {post.poll && <FeedPoll poll={post.poll} postId={post.id} />}
      </PostContent>
      
      <VerticalActions>
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
      </VerticalActions>

      {showComments && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', zIndex: 100 }}>
             <CommentSection post={post} />
        </div>
      )}

    </FullScreenCard>
  );
};

export default PostCard;
