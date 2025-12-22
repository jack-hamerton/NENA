
import { useState } from 'react';
import { Comment } from './Comment';
import { CommentComposer } from './CommentComposer';

export const ThreadedCommentSection = ({ comments, onCommentSubmitted }) => {
  const [showReplies, setShowReplies] = useState({});

  const handleToggleReplies = (commentId) => {
    setShowReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const renderComments = (commentList, parentId = null) => {
    return commentList
      .filter(comment => comment.parentId === parentId)
      .map(comment => (
        <div key={comment.id} style={{ marginLeft: parentId ? '20px' : '0' }}>
          <Comment comment={comment} />
          <button onClick={() => handleToggleReplies(comment.id)}>
            {showReplies[comment.id] ? 'Hide Replies' : 'Show Replies'}
          </button>
          {showReplies[comment.id] && (
            <>
              <CommentComposer 
                postId={comment.postId} 
                parentId={comment.id} 
                onCommentSubmitted={onCommentSubmitted} 
              />
              {renderComments(comments, comment.id)}
            </>
          )}
        </div>
      ));
  };

  return (
    <div>
      <CommentComposer postId={comments[0]?.postId} onCommentSubmitted={onCommentSubmitted} />
      {renderComments(comments)}
    </div>
  );
};
