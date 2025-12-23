
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getComments, createComment } from '../services/post.service';
import Comment from './Comment';
import CommentForm from './CommentForm';

const Section = styled.div`
  margin-top: 1rem;
  border-top: 1px solid ${props => props.theme.palette.dark};
  padding-top: 1rem;
`;

const CommentSection = ({ post }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getComments(post.id);
        setComments(response.data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    fetchComments();
  }, [post.id]);

  const handleAddComment = async (commentData) => {
    try {
      const response = await createComment(post.id, commentData);
      setComments([response.data, ...comments]); // Add new comment to the top
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const handleAddReply = async (commentId, replyData) => {
    try {
      // Note: This assumes your createComment service can handle replies
      const response = await createComment(post.id, { ...replyData, parentId: commentId });
      
      // We need to update the state immutably to show the new reply
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [response.data, ...(comment.replies || [])]
          };
        }
        return comment;
      });
      setComments(updatedComments);

    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };

  // Render top-level comments
  const topLevelComments = comments.filter(comment => !comment.parentId);

  return (
    <Section>
      <CommentForm postId={post.id} onCommentSubmit={handleAddComment} />
      <div>
        {topLevelComments.map(comment => (
          <Comment 
            key={comment.id} 
            comment={comment}
            onReplySubmit={handleAddReply}
            // Pass down replies for this comment
            replies={comments.filter(c => c.parentId === comment.id)}
          />
        ))}
      </div>
    </Section>
  );
};

export default CommentSection;
