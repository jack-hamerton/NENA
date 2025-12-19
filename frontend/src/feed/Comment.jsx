
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import UserAvatar from '../components/UserAvatar';
import { CreateComment } from './CreateComment';

export const Comment = ({ comment, onAddReply }) => {
  const [showReply, setShowReply] = React.useState(false);

  const handleReply = (reply) => {
    onAddReply(reply);
    setShowReply(false);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <UserAvatar user={comment.author} />
      </Box>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {comment.text}
      </Typography>
      <Box>
        <IconButton onClick={() => setShowReply(!showReply)}>
          <Typography>Reply</Typography>
        </IconButton>
      </Box>
      {showReply && <CreateComment postId={comment.post_id} parentId={comment.id} onCommentSubmitted={handleReply} />}
      {comment.replies && comment.replies.length > 0 && (
        <Box sx={{ ml: 4 }}>
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} onAddReply={onAddReply} />
          ))}
        </Box>
      )}
    </Box>
  );
};
