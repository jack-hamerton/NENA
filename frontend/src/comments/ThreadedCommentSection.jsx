
import React, { useState, useEffect } from 'react';

const Comment = ({ comment, replies }) => {
  return (
    <div style={{ marginLeft: '20px', borderLeft: '1px solid #ccc', paddingLeft: '10px' }}>
      <div>{comment.text}</div>
      <small>{comment.author}</small>
      {replies && replies.length > 0 && (
        <div>
          {replies.map(reply => (
            <Comment key={reply.id} comment={reply} replies={[]} />
          ))}
        </div>
      )}
    </div>
  );
};

const ThreadedCommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      // In a real app, you would fetch comments for the given postId
      const mockComments = [
        { id: 1, text: 'This is the first comment', author: 'User A', parentId: null },
        { id: 2, text: 'This is a reply to the first comment', author: 'User B', parentId: 1 },
        { id: 3, text: 'This is another reply to the first comment', author: 'User C', parentId: 1 },
        { id: 4, text: 'This is a nested reply', author: 'User D', parentId: 2 },
        { id: 5, text: 'This is a second-level comment', author: 'User E', parentId: null },
      ];
      setComments(mockComments);
    };

    fetchComments();
  }, [postId]);

  const getReplies = (commentId) => {
    return comments.filter(comment => comment.parentId === commentId);
  };

  return (
    <div>
      {comments.filter(comment => comment.parentId === null).map(comment => (
        <Comment key={comment.id} comment={comment} replies={getReplies(comment.id)} />
      ))}
    </div>
  );
};

export default ThreadedCommentSection;
