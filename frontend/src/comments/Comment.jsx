
import React, { useState } from 'react';
import styled from 'styled-components';
import UserAvatar from '../components/UserAvatar';
import CommentForm from './CommentForm';

const CommentContainer = styled.div`
  padding: 0.75rem;
  border-radius: 8px;
  background-color: ${props => props.theme.palette.darker};
  margin-top: 0.75rem;
`;

const ReplyContainer = styled.div`
  margin-left: 2rem; /* Indent replies */
  border-left: 2px solid ${props => props.theme.palette.dark};
  padding-left: 1rem;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CommentText = styled.p`
  margin: 0.5rem 0;
  color: ${props => props.theme.text.primary};
`;

const ReplyButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text.secondary};
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Comment = ({ comment, onReplySubmit, replies }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReply = (replyData) => {
    onReplySubmit(comment.id, replyData);
    setShowReplyForm(false); // Hide form after submitting
  };

  return (
    <CommentContainer>
      <CommentHeader>
        <UserAvatar user={comment.author} />
      </CommentHeader>
      <CommentText>{comment.text}</CommentText>
      <ReplyButton onClick={() => setShowReplyForm(!showReplyForm)}>
        Reply
      </ReplyButton>
      
      {showReplyForm && <CommentForm postId={comment.postId} onCommentSubmit={handleReply} isReply />}

      {replies && replies.length > 0 && (
        <ReplyContainer>
          {replies.map(reply => (
            <Comment 
              key={reply.id} 
              comment={reply} 
              onReplySubmit={onReplySubmit} 
              // This is a simplification. A real app might need to fetch nested replies.
              replies={[]}
            />
          ))}
        </ReplyContainer>
      )}
    </CommentContainer>
  );
};

export default Comment;
