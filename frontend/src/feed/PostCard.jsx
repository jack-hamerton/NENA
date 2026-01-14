
import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import UserAvatar from '../components/UserAvatar';
import { likePost } from '../services/post.service';
import { IconButton, Typography } from '@mui/material';
import { FavoriteBorder, Favorite, Comment as CommentIcon } from '@mui/icons-material';
import FeedPoll from './FeedPoll';
import CommentModal from '../components/modals/CommentModal';

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
  white-space: pre-wrap; /* To respect newlines in post content */
`;

const Hashtag = styled.span`
  color: ${props => props.theme.palette.accent};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
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

const PostCard = ({ post, onUsernameLongPress, onHashtagClick }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [hasLiked, setHasLiked] = useState(post.hasLiked || false);
  const [isCommentModalOpen, setCommentModalOpen] = useState(false);
  const pressTimer = useRef();

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

  const handlePressStart = useCallback(() => {
    pressTimer.current = setTimeout(() => {
      onUsernameLongPress(post.author.id);
    }, 1000); // 1-second long press
  }, [onUsernameLongPress, post.author.id]);

  const handlePressEnd = useCallback(() => {
    clearTimeout(pressTimer.current);
  }, []);

  const renderContentWithHashtags = (content) => {
    if (!content) return null;
    const hashtagRegex = /(#\w+)/g;
    const parts = content.split(hashtagRegex);

    return parts.map((part, index) => {
      if (part.match(hashtagRegex)) {
        return <Hashtag key={index} onClick={() => onHashtagClick(part)}>{part}</Hashtag>;
      }
      return part;
    });
  };


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
        <PostText>{renderContentWithHashtags(post.content)}</PostText>
        {post.poll && <FeedPoll poll={post.poll} postId={post.id} />}
      </PostContent>
      
      <VerticalActions>
        <Action onClick={handleLike} className={hasLiked ? 'liked' : ''}>
          <IconButton disabled={hasLiked}>
            {hasLiked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <Typography variant="body2">{likes}</Typography>
        </Action>

        <Action onClick={() => setCommentModalOpen(true)}>
          <IconButton>
            <CommentIcon />
          </IconButton>
        </Action>
      </VerticalActions>

      <CommentModal 
        open={isCommentModalOpen} 
        onClose={() => setCommentModalOpen(false)} 
        post={post} 
      />

    </FullScreenCard>
  );
};

export default PostCard;
