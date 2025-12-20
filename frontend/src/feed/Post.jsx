
import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { Poll } from '../rooms/Poll';
import UserAvatar from '../components/UserAvatar';
import { ThreadedCommentSection } from './ThreadedCommentSection';

const Post = ({ post }) => {
  const [isBookmarked, setIsBookmarked] = useState(post.is_bookmarked);
  const [showComments, setShowComments] = useState(false);
  const navigate = useNavigate();

  const handleBookmarkClick = async () => {
    try {
      if (isBookmarked) {
        await postService.unbookmarkPost(post.id);
      } else {
        await postService.bookmarkPost(post.id);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error bookmarking post:', error);
    }
  };

  const handleUserClick = (user) => {
    navigate(`/profile/${user.id}`);
  };

  return (
    <Box sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <UserAvatar user={post.author} />
        <Box sx={{ ml: 2 }}>
          <Typography 
            variant="subtitle1" 
            component="span" 
            sx={{ cursor: 'pointer', fontWeight: 'bold' }} 
            onClick={() => handleUserClick(post.author)}
          >
            {post.author.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">{new Date(post.created_at).toLocaleString()}</Typography>
        </Box>
      </Box>
      <Typography variant="body1" sx={{ mb: 1 }}>{post.text}</Typography>
      {post.media_url && (
        <Box sx={{ mb: 1 }}>
          <img src={post.media_url} alt="Post media" style={{ maxWidth: '100%', borderRadius: '8px' }} />
        </Box>
      )}
      {post.poll && <Poll poll={post.poll} />}
      <Box>
        <IconButton><Typography>Like</Typography></IconButton>
        <IconButton><Typography>Share</Typography></IconButton>
        <IconButton onClick={() => setShowComments(!showComments)}><Typography>Comment</Typography></IconButton>
        <IconButton onClick={handleBookmarkClick}>
          <Typography>{isBookmarked ? "Bookmarked" : "Bookmark"}</Typography>
        </IconButton>
      </Box>
      {showComments && <ThreadedCommentSection postId={post.id} />}
    </Box>
  );
};

export default Post;
