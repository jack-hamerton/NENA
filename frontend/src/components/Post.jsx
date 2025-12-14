
import React from 'react';

export interface PostData {
  id: string;
  author: string;
  content: string;
  isReported: boolean;
}

interface PostProps {
  post: PostData;
  onReport: (postId: string) => void;
}

const Post: React.FC<PostProps> = ({ post, onReport }) => {
  return (
    <div className={`post ${post.isReported ? 'reported' : ''}`}>
      <div className="post-header">
        <span className="author">{post.author}</span>
      </div>
      <div className="post-content">{post.content}</div>
      <div className="post-actions">
        {!post.isReported && <button onClick={() => onReport(post.id)}>Report</button>}
      </div>
    </div>
  );
};

export default Post;
