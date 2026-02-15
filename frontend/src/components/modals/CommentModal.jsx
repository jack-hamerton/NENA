
import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from '../common/Modal';
import CommentSection from '../../comments/CommentSection';

const CommentModalContainer = styled.div`
  width: 80vw;
  max-width: 500px;
  background-color: ${props => props.theme.palette.dark};
  padding: 1rem;
  border-radius: 8px;
`;

const ReadMore = styled.span`
  color: ${props => props.theme.palette.accent};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const CommentModal = ({ open, onClose, post }) => {
  const [showAllComments, setShowAllComments] = useState(false);

  const lastComment = post.comments && post.comments.length > 0 ? post.comments[post.comments.length - 1] : null;

  return (
    <Modal isOpen={open} onClose={onClose}>
      <CommentModalContainer>
        <h3>Comments</h3>
        {lastComment && !showAllComments && (
          <div>
            <p>{lastComment.content}</p>
            {post.comments.length > 1 && (
              <ReadMore onClick={() => setShowAllComments(true)}>Read more</ReadMore>
            )}
          </div>
        )}
        {(showAllComments || !lastComment) && (
          <CommentSection post={post} />
        )}
      </CommentModalContainer>
    </Modal>
  );
};

export default CommentModal;
