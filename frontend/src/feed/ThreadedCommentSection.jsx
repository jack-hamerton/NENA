
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { postService } from '../services/postService';
import { Comment } from './Comment';
import { CreateComment } from './CreateComment';

export const ThreadedCommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const response = await postService.getComments(postId);
      setComments(response.data);
    };
    fetchComments();
  }, [postId]);

  const handleAddComment = async (comment) => {
    const newComment = await postService.addComment(comment);
    setComments([newComment, ...comments]);
  };

  const handleAddReply = async (reply) => {
    const newReply = await postService.addComment(reply);
    // A more sophisticated implementation would update the comments tree
    setComments(comments.map(c => c.id === newReply.parent_id ? { ...c, replies: [newReply, ...(c.replies || [])] } : c));
  };

  return (
    <Box sx={{ mt: 2 }}>
      <CreateComment postId={postId} onCommentSubmitted={handleAddComment} />
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} onAddReply={handleAddReply} />
      ))}
    </Box>
  );
};
