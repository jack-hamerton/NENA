
import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import UserAvatar from '../components/UserAvatar';
import { likePost } from '../services/post.service';
import { IconButton, Typography } from '@mui/material';
import { FavoriteBorder, Favorite, Comment as CommentIcon, Campaign as CampaignIcon } from '@mui/icons-material';
import FeedPoll from './FeedPoll';
import CommentModal from '../components/modals/CommentModal';
import CampaignHubModal from '../components/modals/CampaignHubModal';

const FullScreenCard = styled.div`
  width: 100%;
  scroll-snap-align: start;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 1.25rem 1.5rem;
  color: ${props => props.theme.text?.primary || '#ffffff'};
  background-color: ${props => props.theme.palette?.background?.paper || '#1f2428'};
  border-radius: 12px;
  min-height: 220px;
`;

const PostContent = styled.div`
  padding-right: 64px; /* Space for the vertical actions */
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PostText = styled.p`
  color: #fff;
  margin-bottom: 1rem;
  white-space: pre-wrap; /* To respect newlines in post content */
`;

const MediaContainer = styled.div`
  margin-top: 1rem;
  border-radius: 12px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.3);
  max-height: 400px;
`;

const ImageMedia = styled.img`
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  display: block;
`;

const VideoMedia = styled.video`
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  display: block;
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
  right: 16px;
  top: 64px;
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
  const [isCampaignModalOpen, setCampaignModalOpen] = useState(false);
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
      <PostHeader
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      >
        <UserAvatar user={post.author} />
      </PostHeader>
      <PostContent>
        <PostText>{renderContentWithHashtags(post.content)}</PostText>
        {post.poll && <FeedPoll poll={post.poll} postId={post.id} />}
        {post.image_url && (
          <MediaContainer>
            <ImageMedia src={post.image_url} alt="Post media" />
          </MediaContainer>
        )}
        {post.video_url && (
          <MediaContainer>
            <VideoMedia controls>
              <source src={post.video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </VideoMedia>
          </MediaContainer>
        )}
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

        <Action onClick={() => setCampaignModalOpen(true)}>
          <IconButton>
            <CampaignIcon />
          </IconButton>
        </Action>
      </VerticalActions>

      <CommentModal 
        open={isCommentModalOpen} 
        onClose={() => setCommentModalOpen(false)} 
        post={post}
        // TODO: Implement the new comment display logic
      />

      <CampaignHubModal
        open={isCampaignModalOpen}
        onClose={() => setCampaignModalOpen(false)}
        post={post}
      />
    </FullScreenCard>
  );
};

export default PostCard;
