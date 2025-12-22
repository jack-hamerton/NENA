
import { useState } from 'react';
import { CommentComposer } from './CommentComposer';

export const Comment = ({ comment, onCommentSubmitted }) => {
  const [showReply, setShowReply] = useState(false);

  const handleReplySuccess = (newReply) => {
    setShowReply(false); 
    // Pass the new reply up to the parent to be added to the main list
    onCommentSubmitted(newReply);
  }

  return (
    <div>
      <p><strong>{comment.author}</strong>: {comment.text}</p>
      <button onClick={() => setShowReply(!showReply)}>
        {showReply ? 'Cancel' : 'Reply'}
      </button>
      {showReply && (
        <CommentComposer 
          postId={comment.postId} 
          parentId={comment.id} 
          onCommentSubmitted={handleReplySuccess} 
        />
      )}
    </div>
  );
};
